import { Reducer } from "redux"
import { AVAILABLE_PAIRS } from "../../constants/constants"
import { OrderBookActionTypes } from "../../enums/OrderBook"
import { IOrderBookApiData } from "../../interfaces/OrderBook"

export interface OrderBookAction {
    type: OrderBookActionTypes
    socket?: WebSocket
    data?: IOrderBookApiData
}

export interface IOrderBookState {
    connected: boolean
    paused: boolean
    selectedPair: typeof AVAILABLE_PAIRS[number]
    asks: string[]
    bids: string[]
    socket?: WebSocket
    timestamp?: string
}

const initialState: IOrderBookState = {
    connected: false,
    paused: false,
    asks: [],
    bids: [],
    selectedPair: "btceur",
}
export const orderBookReducer: Reducer<IOrderBookState, OrderBookAction> = (state: IOrderBookState = initialState, action: OrderBookAction) => {
    switch (action.type) {
        case OrderBookActionTypes.SocketConnectionInit:
            return { ...state, connected: false, socket: action.socket }

        case OrderBookActionTypes.SocketConnectionSuccess:
            return { ...state, connected: true }

        case OrderBookActionTypes.SocketConnectionPause:
            return { ...state, paused: !state.paused }

        case OrderBookActionTypes.SocketConnectionError:
            return { ...state, connected: false }

        case OrderBookActionTypes.SocketConnectionClosed:
            return { ...state, connected: false, socket: undefined }

        case OrderBookActionTypes.SocketConnectionMessage:
            if (state.paused) return { ...state }
            if (!state.connected) return { ...state }

            const asks = action.data?.data.asks
            const bids = action.data?.data.bids
            const filteredBids: string[] = []
            const filteredAsks: string[] = []

            if (asks) {
                asks.filter((ask) => {
                    if (parseFloat(ask[1]) !== 0.0) filteredAsks.push(ask)
                })
            }
            if (bids) {
                bids.filter((bid) => {
                    if (parseFloat(bid[1]) !== 0.0) filteredBids.push(bid)
                })
            }
            return {
                ...state,
                bids: [...filteredBids, ...state.bids].splice(0, 5),
                asks: [...filteredAsks, ...state.asks].splice(0, 5),
                timestamp: action.data?.data.timestamp,
            }

        default:
            return state
    }
}
