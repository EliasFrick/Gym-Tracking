import { IFetchDataFromFirestore } from '@/types/interfaces';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { firestoreDB } from './Firebaseconfig';

export const fetchDataFromFirestore = async (props: IFetchDataFromFirestore): Promise<DocumentData[]> => {
  try {
    const querySnapshot = await getDocs(collection(firestoreDB, props.collectionName));
    const data: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
