import { Dispatch } from "react"
import {
    socketConnectionInit,
    socketConnectionClosed,
    socketConnectionToggle,
    socketConnectionSuccess,
    socketConnectionError,
    socketMessage,
} from "../components/order-book/OrderBookActions"
import { OrderBookAction } from "../components/order-book/orderBookReducer"
import { SocketStateTypes } from "../interfaces/OrderBook"

export const initializeOrderBookSocket = (url: string, pair: string) => {
    return (dispatch: Dispatch<OrderBookAction>) => {
        const socket = new WebSocket(url)
        dispatch(socketConnectionInit(socket))

        socket.onopen = () => {
            socketSend(socket, "subscribe", pair)
            dispatch(socketConnectionSuccess())
        }

        socket.onerror = () => {
            dispatch(socketConnectionError())
        }

        socket.onmessage = (event) => {
            dispatch(socketMessage(JSON.parse(event.data)))
        }

        socket.onclose = () => {
            dispatch(socketConnectionClosed())
        }
    }
}
export const toggleSocketState = () => {
    return (dispatch: Dispatch<OrderBookAction>) => {
        dispatch(socketConnectionToggle())
    }
}
export const socketSend = (socket: WebSocket, sub: SocketStateTypes, pair: string) => {
    socket.send(
        JSON.stringify({
            event: `bts:${sub}`,
            data: {
                channel: `diff_order_book_${pair}`,
            },
        }),
    )
}
