import { faPause, faPlay, faRedo, faUndo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import moment from "moment"
import React, { useEffect, useMemo } from "react"
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native"
import { BarChart } from "react-native-chart-kit"
import { useDispatch, useSelector } from "react-redux"
import { ApplicationState } from "../../../rootReducer"
import { initializeOrderBookSocket, socketSend, toggleSocketState } from "../../api/orderBookApi"

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

    const asksData = useMemo(() => {
        return {
            labels: asks.map((ask) => ask[0].substring(0, 5)),
            datasets: [
                {
                    data: asks.map((ask) => +ask[1].substring(0, 5)),
                },
            ],
        }
    }, [asks])

    const bidsData = useMemo(() => {
        return {
            labels: bids.map((bid) => bid[0].substring(0, 5)),
            datasets: [
                {
                    data: bids.map((bid) => +bid[1].substring(0, 5)),
                },
            ],
        }
    }, [bids])

    return (
        <View>
            {!connected || !asks.length || !bids.length ? (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#00e673" />
                </View>
            ) : (
                <View>
                    <View>
                        <View style={styles.headerActions}>
                            {timestamp ? <Text style={styles.timeText}>{moment.unix(parseInt(timestamp, 10)).format("HH:mm:ss")}</Text> : <View />}
                            <Text onPress={togglePause}>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
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

                        <Text style={styles.sectionTitle}>Asks</Text>
                        <BarChart
                            yAxisSuffix=""
                            style={{
                                marginVertical: 8,
                            }}
                            data={asksData}
                            xAxisLabel="€"
                            width={Dimensions.get("window").width}
                            showValuesOnTopOfBars
                            height={220}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 0, 102, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 0, 102, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },

                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726",
                                },
                            }}
                        />
                    </View>
                    <Text style={styles.sectionTitle}>Bids</Text>
                    <View>
                        <BarChart
                            yAxisSuffix=""
                            xAxisLabel="€"
                            style={{
                                marginVertical: 8,
                            }}
                            data={bidsData}
                            width={Dimensions.get("window").width}
                            height={220}
                            yAxisLabel=""
                            showValuesOnTopOfBars
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",

                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(0, 230, 115, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 230, 115, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726",
                                },
                            }}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    headerActions: { display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 10, alignItems: "center" },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
        paddingLeft: 24,
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
