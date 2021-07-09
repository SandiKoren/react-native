export enum OrderBookActionTypes {
    SocketConnectionInit = "SOCKET_CONNECTION_INIT",
    SocketConnectionSuccess = "SOCKET_CONNECTION_SUCCESS",
    SocketConnectionError = "SOCKET_CONNECTION_ERROR",
    SocketConnectionClosed = "SOCKET_CONNECTION_CLOSED",
    SocketConnectionMessage = "SOCKET_MESSAGE",
    SocketConnectionPause = "SOCKET_PAUSE",
}
