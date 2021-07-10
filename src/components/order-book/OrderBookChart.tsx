import React, { useMemo } from "react"
import { View, Text, Dimensions, StyleSheet } from "react-native"
import { BarChart } from "react-native-chart-kit"

interface OrderBookChartData {
    data: string[]
    title: string
    type: "asks" | "bids"
}

export const OrderBookChart = ({ data, title, type }: OrderBookChartData) => {
    const chartData = useMemo(() => {
        return {
            labels: data
                .map((item) => item[0].substring(0, 5))
                .sort((a, b) => {
                    return +a - +b
                }),
            datasets: [
                {
                    data: data.map((ask) => +ask[1].substring(0, 5)),
                },
            ],
        }
    }, [data])

    return (
        <View>
            <Text style={styles.chartTitle}>{title}</Text>
            <View>
                <BarChart
                    yAxisSuffix=""
                    xAxisLabel="€"
                    style={{
                        marginVertical: 8,
                    }}
                    data={chartData}
                    width={Dimensions.get("window").width}
                    height={220}
                    yAxisLabel=""
                    showValuesOnTopOfBars
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",

                        decimalPlaces: 2,
                        color: (opacity = 1) => (type === "asks" ? `rgba(255, 0, 102, ${opacity})` : `rgba(0, 230, 115, ${opacity})`),
                        labelColor: (opacity = 1) => (type === "asks" ? `rgba(255, 0, 102, ${opacity})` : `rgba(0, 230, 115, ${opacity})`),
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
    )
}

const styles = StyleSheet.create({
    chartTitle: {
        fontSize: 24,
        fontWeight: "600",
        paddingLeft: 24,
    },
})
