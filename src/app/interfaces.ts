import { Observable } from "rxjs"

export interface User {
    email: string | null
    displayName: string | null
    photoURL: string | null
    uid: string
    accessToken: string | null
    refreshToken: string | null
    other: string | null
}

export interface  ITokenizeUser{
    access_token: string;
    refresh_token: string;
    user: User;
}

export  interface IToken{
    access_token: string;
    refresh_token: string;
}

export interface UserListItem {
    displayName: string
    photoURL: string | null
    uid: string
    added: boolean
}

export interface FriendsListItem {
    displayName: string
    photoURL: string | null
    uid: string
    acceptedStatus: string | undefined | null
    roomId: string
    updatedAt: string

}

export interface IAcceptedFriend {
    displayName: string
    photoURL: string
    uid: string
}

export interface AddUser {
    displayName: string | null
    createdAt: string | number | null
    docId: string | null
    roomId: string | null
    updatedAt: string | null
}



export interface iMessagePayload {
    value: string
    msg_type: string
    chat_room_id: string
    user_uid: string
}

export interface iMessage {
    value: string
    type: string
    createdAt: object | number | null
    status: string | null
    user: {
        displayName: string
        photoURL: string
        uid: string
    } | null
}

export interface AddedFriends {
    displayName: string
    uid: string
    roomId: string
    acceptedStatus: string
    updatedAt: string
}

export interface ApiResults<T> {
    count: number,
    next: string | null
    previous: string | null
    results: T[]
}

export enum RequestAcceptedStatus {
    PENDING = 1,
    ACCEPTED = 2,
    REJECTED = 3,
    CANCELED = 4,

}

export enum ReloadStatus {
    CHAT_LIST = 1,
    CHAT_DETAIL = 2,
    All_FRIENDS_LIST = 3,
    FRIEND_REQUEST = 4
}

export enum IChatRoomType {
    PERSONAL = "PERSONAL",
    GROUP = "GROUP"
}

export enum IMemberRole{
    CREATOR = 'CREATOR',
    ADMIN = 'ADMIN',
    REGULAR = 'REGULAR',
}

export interface IChatRoom {
    id: number;
    room_id: string;
    type: IChatRoomType;
    display_property: {
        displayName: string;
        photoURL: string;
    };
    last_message: string;
}

export interface IGetChatRoomResponse {
    found: boolean;
    chatRoom: IChatRoom;
}

export interface IMembers {
    id: number;
    role: IMemberRole;
    createdAt: string;
    user: {
        displayName: string
        photoURL: string
        uid: string
    }
}

export interface IMembersSplitter{
    others: IMembers[];
    current: IMembers;
}

export interface Notification {
    content: any
    to: string
    from: string
    type: string | null
    reloadRequired: boolean,
    reloadStatus: number
}

export enum NotificationType {
    MESSAGE = 'message',
    NOTIFY = 'notify',
    ERROR = 'error',
    NEWMSG = 'new-message'
}

export interface IBaseResponse{
    detail: string;
    error?: boolean;
}

export interface IMultiSelectFilterService{
    clearSelection$: Observable<any>; 
    filterBySearchTerm:(searchTerm:string)=>Observable<IAcceptedFriend[]>;
}