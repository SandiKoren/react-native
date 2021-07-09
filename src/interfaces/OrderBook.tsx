export interface IOrderBookApiData {
    channel: string
    data: {
        asks: string[]
        bids: string[]
        microtimestamp: string
        timestamp: string
    }
    event: string
}

export type SocketStateTypes = "subscribe" | "unsubscribe"
