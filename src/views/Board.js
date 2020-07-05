import React, { useState, useRef } from "react";
import * as d3 from "d3";

// Data
import generalMetadata from "./../assets/datasets/metadata.json";
import generalHeaders from "./../assets/datasets/headers.json";
import lphMetadata from "./../assets/datasets/orgUnits/lph_metadata.json";
import lphHeaders from "./../assets/datasets/orgUnits/lph_headers.json";

// Hooks
import useWindowDimensions from "./../hooks/windowDimensions";

// Components
import IconBtn from "./../components/IconBtn";

// Charts
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";

const Board = () => {
    const btn = useRef(null);
    const usableIcons = [
        "bar_graph_pretty",
        "line_plot",
        "graph",
        "pie_chart",
        "africa",
        "scatter",
        "graph_and_plot",
    ];
    const [active, setActive] = useState(usableIcons[0]);
    const [btnSize, setBtnSize] = useState(30);
    const [marginSize, setMarginSize] = useState(20);
    const { height, width } = useWindowDimensions();
    const datasetBar = [5, 10, 13, 19, 21, 25, 11, 25, 22, 18, 7];

    const datasetLine = [
        { month: 10, sales: 100 },
        { month: 20, sales: 130 },
        { month: 30, sales: 250 },
        { month: 40, sales: 300 },
        { month: 50, sales: 265 },
        { month: 60, sales: 225 },
        { month: 70, sales: 180 },
        { month: 80, sales: 120 },
        { month: 90, sales: 145 },
        { month: 100, sales: 130 },
    ];
    const chartWidth = 0.55 * width;
    const chartHeight = 0.55 * height;

    // const chartWidth = 400;
    // const chartHeight = 300;

    console.log("LPH metadata is", lphMetadata);

    return (
        <div style={styles.boardContainer}>
            {/* Chart & KPI */}
            <div style={styles.chartContainer}>
                {/* Chart */}
                <div style={styles.chartWrapper}>
                    <h5 style={styles.titles}>Chart</h5>
                    {active === "bar_graph_pretty"
                        ? datasetBar &&
                          datasetBar.length && (
                              <BarChart
                                  dataset={datasetBar}
                                  chartWidth={chartWidth}
                                  chartHeight={chartHeight}
                              />
                          )
                        : active === "line_plot"
                        ? datasetLine &&
                          datasetLine.length && (
                              <LineChart
                                  dataset={datasetLine}
                                  chartWidth={chartWidth}
                                  chartHeight={chartHeight}
                              />
                          )
                        : ""}
                </div>

                {/* KPI */}
                <div style={styles.kpiWrapper}>
                    <h5 style={styles.titles}>KPI</h5>
                </div>
            </div>

            {/* Icons */}
            <div style={styles.btnContainer}>
                {usableIcons.map((iconName) => {
                    return (
                        <IconBtn
                            key={Math.random()}
                            size={btnSize}
                            margin={marginSize}
                            icon={iconName}
                            bw={active !== iconName}
                            onClick={() => {
                                setActive(iconName);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    boardContainer: {
        display: "flex",
        flexDirection: "row",
        width: "90vw",
        height: "90vh",
        margin: "auto auto auto auto",
    },
    btnContainer: {
        flex: 3,
        borderLeft: "2px solid #fff",
    },
    chartContainer: {
        flex: 9,
        display: "flex",
        flexDirection: "column",
    },
    chartWrapper: {
        border: "1px solid #fff",
        flex: 9,
        padding: 10,
    },
    kpiWrapper: {
        flex: 3,
    },
    titles: {
        textAlign: "left",
    },
};
export default Board;
