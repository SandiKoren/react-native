import { Dispatch } from "redux"
import {
    socketConnectionInit,
    socketConnectionClosed,
    socketConnectionSuccess,
    socketConnectionError,
    socketMessage,
} from "../components/order-book/OrderBookActions"
import { OrderBookAction } from "../components/order-book/orderBookReducer"
import { AVAILABLE_PAIRS } from "../constants/constants"
import { SocketStateTypes } from "../interfaces/OrderBook"

export const initializeOrderBookSocket = (url: string, pair: typeof AVAILABLE_PAIRS[number]) => {
    return (dispatch: Dispatch<OrderBookAction>) => {
        const socket = new WebSocket(url)
        dispatch(socketConnectionInit(socket))

        socket.onopen = () => {
            socketSend({ socket, pair, sub: "subscribe" })
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
export const socketSend = ({ ...options }: { socket: WebSocket; sub: SocketStateTypes; pair: typeof AVAILABLE_PAIRS[number] }) => {
    options.socket.send(
        JSON.stringify({
            event: `bts:${options.sub}`,
            data: {
                channel: `diff_order_book_${options.pair}`,
            },
        }),
    )
}
