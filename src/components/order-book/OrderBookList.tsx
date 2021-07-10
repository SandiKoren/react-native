import { faPause, faPlay, faRedo, faUndo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import moment from "moment"
import React, { useEffect } from "react"
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { ApplicationState } from "../../../rootReducer"
import { initializeOrderBookSocket, socketSend, toggleSocketState } from "../../api/orderBookApi"
import { OrderBookChart } from "./OrderBookChart"

export const OrderBookList = () => {
    const { asks, bids, paused, connected, timestamp, socket, selectedPair } = useSelector((state: ApplicationState) => state.orderBook)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeOrderBookSocket("wss://ws.bitstamp.net", selectedPair))

        return () => {
            if (socket) socket.close()
        }
    }, [dispatch])

    const togglePause = () => {
        dispatch(toggleSocketState())

        if (!socket) return
        paused ? socketSend(socket, "subscribe", selectedPair) : socketSend(socket, "unsubscribe", selectedPair)
    }

    return (
        <View>
            {!connected || !asks.length || !bids.length ? (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#00e673" />
                </View>
            ) : (
                <View>
                    <View>
                        <View style={styles.header}>
                            {timestamp ? <Text style={styles.timeText}>{moment.unix(parseInt(timestamp, 10)).format("HH:mm:ss")}</Text> : <View />}
                            <Text onPress={togglePause}>
                                <View style={styles.headerActions}>
                                    {paused && (
                                        <>
                                            <FontAwesomeIcon icon={faUndo} style={styles.iconStyle} />
                                            <FontAwesomeIcon icon={faRedo} style={styles.iconStyle} />
                                        </>
                                    )}
                                    <FontAwesomeIcon icon={paused ? faPlay : faPause} style={styles.iconStyle} />
                                </View>
                            </Text>
                        </View>

                        <OrderBookChart data={asks} title="Asks" type="asks" />
                        <OrderBookChart data={bids} title="Bids" type="bids" />
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: { display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 10, alignItems: "center" },
    headerActions: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    timeText: { marginLeft: 15, fontSize: 24 },
    container: {
        flex: 1,
        justifyContent: "center",
        height: Dimensions.get("window").height,
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    iconStyle: {
        margin: 15,
    },
})
