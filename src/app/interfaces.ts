export interface User{
    email:string|null
    displayName:string|null
    photoURL:string|null
    uid:string
    refreshToken:string,
    other:string
}

export interface AddUser{
    displayName:string|null,
    createdAt:string|number|null,
    docId:string|null,
    roomId:string|null,
    updatedAt:string|null,
}

export interface Message{
    from:string,
    message:string,
    createdAt:object|number|null
}