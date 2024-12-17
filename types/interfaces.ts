export interface IUserLoginCredentials {
    email: string,
    password: string
}

export interface IUserRegisterCredentials {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    passwordConfirm: string
}

export interface IUser {
    firstname: string,
    lastname: string,
    email: string,
    uId: string
}