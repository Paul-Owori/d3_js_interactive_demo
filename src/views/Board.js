import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

// Data
import generalMetadata from "./../assets/datasets/metadata.json";
import generalHeaders from "./../assets/datasets/headers.json";
import lphMetadata from "./../assets/datasets/orgUnits/lph_metadata.json";
import lphHeaders from "./../assets/datasets/orgUnits/lph_headers.json";
import mtshHeaders from "./../assets/datasets/orgUnits/mtsh_headers.json";
import mtshMetadata from "./../assets/datasets/orgUnits/mtsh_metadata.json";

// Assets
import Colors from "./../assets/colors/colors";

// Hooks
import useWindowDimensions from "./../hooks/windowDimensions";

// Components
import IconBtn from "./../components/IconBtn";

// Charts
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import BarChartMonthly from "./charts/BarChartMonthly";

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
    const [monthCode, setMonthCode] = useState("");
    const { height, width } = useWindowDimensions();
    const [datasetBar, setDatasetBar] = useState([
        5,
        10,
        13,
        19,
        21,
        25,
        11,
        25,
        22,
        18,
        7,
    ]);
    const [lphData, setLphData] = useState("");
    const [mtshData, setMtshData] = useState("");
    const [generalData, setGeneralData] = useState("");

    const [datasetLine, setDatasetLine] = useState([
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
    ]);

    const chartWidth = 0.6 * width;
    const chartHeight = 0.4 * height;

    const miniChartWidth = 0.5 * chartWidth;
    const miniChartHeight = 0.4 * height;

    const extractDatasets = (metaInput, headers) => {
        // X Values and Key Performance Indicators
        const dimensions = metaInput.metaData.dimensions;
        const months = dimensions.pe;
        const kPIValues = dimensions.dx;
        let finalX = [];
        let finalKPI = [];
        months.forEach((val) => {
            finalX.push(metaInput.metaData.items[val]);
        });

        kPIValues.forEach((val) => {
            finalKPI.push(metaInput.metaData.items[val]);
        });

        // Actual data values
        const dataSets = headers.rows;

        // console.log("Months are ", finalX); // the uid and also the actual name of the month

        // console.log("dataSets are ", dataSets); // The weird id, the month id and the value for the graph

        //console.log("kPIValues are", finalKPI);  // the weird id and the name of the key performance indicator

        const singleBarChartWidth = chartWidth / finalX.length; // Subtract padding
        return {
            months: finalX,
            kPIValues: finalKPI,
            dataSets,
            uids: kPIValues,
            colors: Colors,
        };
    };

    // Create the datasets
    useEffect(() => {
        setLphData(extractDatasets(lphMetadata, lphHeaders));
        setMtshData(extractDatasets(mtshMetadata, mtshHeaders));
        setGeneralData(extractDatasets(generalMetadata, generalHeaders));

        return () => {};
    }, []);

    const changeMonthCode = (code) => {
        console.log("Code received is", code);
        setMonthCode(code);
    };

    return (
        <div style={styles.boardContainer}>
            {/* LEFT */}
            <div style={styles.leftBoard}>
                <div
                    style={{ ...styles.leftTop, ...styles.topPartition }}
                ></div>
                <div style={styles.middlePartition}>
                    {/* Chart Main */}
                    <div style={styles.chartWrapper}>
                        {/* <h5 style={styles.titles}>Chart</h5> */}
                        {/* active === "bar_graph_pretty"
                            ? */}
                        {generalData && (
                            <BarChart
                                dataset={generalData}
                                chartWidth={chartWidth}
                                chartHeight={chartHeight}
                                monthCode={monthCode}
                                setMonthCode={setMonthCode}
                            />
                        )}
                    </div>
                </div>
                <div style={styles.bottomPartition}>
                    <div style={styles.bottomPartLeft}>
                        {generalData && monthCode && (
                            <PieChart
                                dataset={generalData}
                                chartWidth={miniChartWidth}
                                chartHeight={miniChartHeight}
                                monthCode={monthCode}
                            />
                        )}
                    </div>
                    <div style={styles.bottomPartRight}>
                        {generalData && monthCode && (
                            <BarChartMonthly
                                dataset={generalData}
                                chartWidth={miniChartWidth}
                                chartHeight={miniChartHeight}
                                monthCode={monthCode}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div style={styles.rightBoard}>
                <div
                    style={{ ...styles.rightTop, ...styles.topPartition }}
                ></div>
                <div style={styles.mapPartition}></div>
            </div>
            {/* Chart & KPI */}
            {/* <div style={styles.chartContainer}>
               

                <div style={styles.kpiWrapper}>
                    <h5 style={styles.titles}>KPI</h5>
                </div>
            </div> */}

            {/* Icons */}
            {/* <div style={styles.btnContainer}>
                {usableIcons.map((iconName) => {
                    return (
                        <IconBtn
                            key={Math.random()}
                            size={btnSize}
                            margin={marginSize}
                            icon={iconName}
                            bw={active !== iconName}
                            onClick={() => {
                                // logData();
                                setActive(iconName);
                            }}
                        />
                    );
                })}
            </div> */}
        </div>
    );
};
const dark = false;
const themeColor = dark ? "#fff" : "#1a1b1d";
const borderThickness = "2.5px";
const styles = {
    boardContainer: {
        display: "flex",
        flexDirection: "row",
        width: "95vw",
        height: "95vh",
        margin: "auto auto auto auto",
    },

    leftBoard: {
        // border: `${borderThickness} solid ${themeColor}`,
        borderRight: `${borderThickness} solid ${themeColor}`,
        flex: 8,
        display: "flex",
        flexDirection: "column",
    },
    rightBoard: {
        // borderRight: `${borderThickness} solid ${themeColor}`,
        // borderTop: `${borderThickness} solid ${themeColor}`,
        // borderBottom: `${borderThickness} solid ${themeColor}`,
        flex: 4,
        display: "flex",
        flexDirection: "column",
    },
    topPartition: {
        flex: 2,
        borderBottom: `${borderThickness} solid ${themeColor}`,
    },
    middlePartition: {
        flex: 5,
        borderBottom: `${borderThickness} solid ${themeColor}`,
    },
    bottomPartition: {
        flex: 5,
        display: "flex",
    },
    bottomPartLeft: {
        borderRight: `${borderThickness} solid ${themeColor}`,
        flex: 6,
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "flex-end",
    },
    bottomPartRight: {
        flex: 6,
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "flex-end",
    },
    mapPartition: {
        flex: 10,
    },
    chartContainer: {
        flex: 9,
        display: "flex",
        flexDirection: "column",
    },
    chartWrapper: {
        // border: "2px solid #000",
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
