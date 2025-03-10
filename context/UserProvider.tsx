import React, { createContext, ReactNode, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { IUserContextType, IUserProvider } from "@/types/interfaces";
import { auth, firestoreDB, storage } from "@/database/Firebaseconfig";

export const UserContext = createContext<IUserContextType>({
  userData: null,
  loading: true,
  error: null,
  refreshUserData: async () => {},
  updateProfileImage: async () => {},
  deleteProfileImage: async () => {},
});

export function UserProvider({ children }: React.PropsWithChildren) {
  const [userData, setUserData] = useState<IUserProvider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;

  /**
   * Fetch the current user document from Firestore
   */
  const fetchUserData = async () => {
    let firstSyncUser;
    if (!user?.uid) {
      firstSyncUser = auth.currentUser;
      if (!firstSyncUser) {
        return;
      } else if (firstSyncUser) {
        try {
          setLoading(true);
          setError(null);

          const userDocRef = doc(firestoreDB, "User", firstSyncUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as IUserProvider);
          } else {
            setError("User not found");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    }
    try {
      setLoading(true);
      setError(null);

      const userDocRef = doc(firestoreDB, "User", user!.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as IUserProvider);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manually refresh user data (e.g., after updates)
   */
  const refreshUserData = async () => {
    await fetchUserData();
  };

  /**
   * Internal helper to upload a local file (URI) to Firebase Storage
   * and return its download URL.
   */
  const uploadProfileImageToStorage = async (
    localUri: string
  ): Promise<string | null> => {
    if (!user?.uid) return null;

    try {
      // Convert URI to Blob
      const response = await fetch(localUri);
      const blob = await response.blob();

      // Reference in Storage: profilePhotos/{userId}.jpg
      const storageRef = ref(storage, `profilePhotos/${user.uid}.jpg`);

      // Upload the file
      await uploadBytes(storageRef, blob);

      // Retrieve the download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (err) {
      console.error("Error uploading profile image:", err);
      return null;
    }
  };

  /**
   * Upload or replace the user’s profile image in Firebase Storage
   * and update Firestore with the new URL.
   */
  const updateProfileImage = async (localUri: string) => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const downloadURL = await uploadProfileImageToStorage(localUri);

      if (!downloadURL) {
        setError("Failed to get download URL from Firebase Storage.");
        return;
      }

      // Update Firestore
      await updateDoc(doc(firestoreDB, "User", user.uid), {
        profileImage: downloadURL,
      });

      // Update our local state
      setUserData((prev) =>
        prev ? { ...prev, profileImage: downloadURL } : null
      );
    } catch (err) {
      console.error("Error updating profile image:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete the user's profile image from Firebase Storage and Firestore
   */
  const deleteProfileImage = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      // Delete from Storage
      const storageRef = ref(storage, `profilePhotos/${user.uid}.jpg`);
      await deleteObject(storageRef).catch((err) => {
        // If the object doesn't exist, it's fine. We'll just log it.
        console.log("No existing profile image in storage to delete:", err);
      });

      // Remove from Firestore
      await updateDoc(doc(firestoreDB, "User", user.uid), {
        profileImage: "",
      });

      // Update our local state
      setUserData((prev) => (prev ? { ...prev, profileImage: "" } : null));
    } catch (err) {
      console.error("Error deleting profile image:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [user?.uid]);

  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        error,
        refreshUserData,
        updateProfileImage,
        deleteProfileImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for using the user context
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
