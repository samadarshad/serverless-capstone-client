export interface MessageType {
    name?: string
    userId: string
    room: string
    message?: string
    postedAt: string
    isDeleted?: boolean
    modifiedAt?: string
}