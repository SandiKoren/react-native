import { combineReducers } from "redux"
import { orderBookReducer } from "./src/components/order-book/orderBookReducer"

export const rootReducer = combineReducers({
    orderBook: orderBookReducer,
})

export type ApplicationState = ReturnType<typeof rootReducer>
