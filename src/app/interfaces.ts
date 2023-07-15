export interface User {
    email: string | null
    displayName: string | null
    photoURL: string | null
    uid: string
    accessToken: string | null
    refreshToken: string | null
    other: string | null
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

export enum ChatRoomType {
    PERSONAL = "PERSONAL",
    GROUP = "GROUP"
}

export interface ChatRoomItem {
    id: number;
    room_id: string;
    type: ChatRoomType;
    display_name: string;
    last_message: string;
}



export interface Notification {
    content: string
    to: string
    from: string
    type: string | null
    reloadRequired: boolean,
    reloadStatus: number
}

export enum NotificationType {
    MESSAGE = 'message',
    NOTIFY = 'notify',
    ERROR = 'error'
}