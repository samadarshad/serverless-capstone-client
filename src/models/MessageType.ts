export interface MessageType {
    name?: string
    userId: string
    room: string
    message?: string
    postedAt: string
    subAction?: string
    deleteMessage?: boolean
}