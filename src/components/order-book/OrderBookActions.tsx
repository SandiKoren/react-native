import { Dispatch } from "redux"
import { OrderBookActionTypes } from "../../enums/OrderBook"
import { IOrderBookApiData } from "../../interfaces/OrderBook"
import { OrderBookAction } from "./orderBookReducer"

export const socketConnectionInit = (socket: WebSocket) => {
    return {
        type: OrderBookActionTypes.SocketConnectionInit,
        socket,
    }
}

export const socketConnectionSuccess = () => {
    return {
        type: OrderBookActionTypes.SocketConnectionSuccess,
    }
}

export const socketConnectionError = () => {
    return {
        type: OrderBookActionTypes.SocketConnectionError,
    }
}

export const socketConnectionClosed = () => {
    return {
        type: OrderBookActionTypes.SocketConnectionClosed,
    }
}
export const socketConnectionToggle = () => {
    return {
        type: OrderBookActionTypes.SocketConnectionPause,
    }
}
export const socketConnectionClose = () => {
    return {
        type: OrderBookActionTypes.SocketConnectionPause,
    }
}

export const socketMessage = (data: IOrderBookApiData): OrderBookAction => {
    return {
        type: OrderBookActionTypes.SocketConnectionMessage,
        data: data,
    }
}
