export interface User{
    email:string|null
    displayName:string|null
    photoURL:string|null
    uid:string
    accessToken:string|null
    refreshToken:string|null
    other:string|null
}

export interface UserListItem{
    displayName:string
    photoURL:string|null
    uid:string
    added:boolean
}

export interface FriendsListItem{
    displayName:string
    photoURL:string|null
    uid:string
    acceptedStatus:string|undefined|null
    roomId:string
    updatedAt:string

}

export interface AddUser{
    displayName:string|null,
    createdAt:string|number|null,
    docId:string|null,
    roomId:string|null,
    updatedAt:string|null,
}

export interface Message{
    from_uid:string
    content:string
    createdAt:object|number|null
    roomId:string
}

export interface AddedFriends{
    displayName:string
    uid:string
    roomId:string
    acceptedStatus:string
    updatedAt:string
}

export interface ApiResults<T>{
    count:number,
    next:string|null,
    previous:string|null,
    results:T[]
}

export enum RequestAcceptedStatus{
    PENDING = 1,
    ACCEPTED = 2,
    REJECTED = 3,
    CANCELED = 4,

}

export enum ReloadStatus{
    CHAT_LIST = 1,
    CHAT_DETAIL = 2,
}