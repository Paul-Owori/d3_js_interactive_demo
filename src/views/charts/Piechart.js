import React, { useRef, useEffect, useState } from "react";
import "d3-selection-multi";
import * as d3 from "d3";
import * as d3Functions from "../../utilities/d3Functions";

const Labels = ({ chartWidth, chartHeight, dataset, monthCode }) => {
    const barChartRef = useRef(null);
    const scaleAllowance = 1;
    const [sortedData, setSortedData] = useState("");

    // Svg
    const canvasWidth = 0.9 * chartWidth;
    const canvasHeight = 0.9 * chartHeight;
    const padding = 2;
    const textVerticalPadding = 18;

    useEffect(() => {
        return () => {};
    }, []);

    const colorPicker = (colors, id) => {
        return colors[id];
    };

    const getMonthData = (code) => {
        const info = dataset.dataSets.filter((obj) => obj[1] === code);

        return info;
    };

    useEffect(() => {
        // Construct data for one month.
        // Display it
        // Build a function that loops through each month and appends a new svg
        // Append them horizontally, ie use flex
        // Build legends
        // Build a map
        // Make the map responsive

        const arrayByMonth = [];
        let sortedDatasets = [];

        let r;
        for (r = 0; r < dataset.months.length; r++) {
            let code = dataset.months[r].code;
            if (code === monthCode) {
                let monthArray = getMonthData(dataset.months[r].code);
                arrayByMonth.push(monthArray);
                sortedDatasets = [...sortedDatasets, ...monthArray];
            }
        }

        // console.log("Data set received is", )
        // console.log("Array by month is ", arrayByMonth);
        setSortedData(arrayByMonth);

        // const month1 = dataset.months[0].code;
        // getMonthData(month1);
        // const month1DataSet = month1.

        // Good to go.
        const svgCanvas = d3
            .select(barChartRef.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        const pieData = d3
            .pie()
            .sort(null)
            .value((dataObj) => {
                // console.log("dataObj is", dataObj[2]);
                return dataObj[2];
            })(sortedDatasets);

        const pieSegments = d3
            .arc()
            .innerRadius(canvasHeight / 20)
            .outerRadius(canvasHeight / 2.2)
            .padAngle(0.05)
            .padRadius(50);

        const pieSections = svgCanvas
            .append("g")
            .attr(
                "transform",
                `translate(${canvasWidth / 2}, ${canvasHeight / 2})`
            )
            .selectAll("path")
            .data(pieData);

        pieSections
            .enter()
            .append("path")
            .attrs({
                d: pieSegments,
                // fill: (data) => colorPicker(dataset.colors, data[0]),
            })
            .style("fill", (data, index) => {
                console.log("data is ", data);
                return colorPicker(dataset.colors, data.data[0]);
            });
        // console.log("PIEDATA IS", pieData);
        const scaleY = d3Functions.scaleYArrSmall(
            arrayByMonth,
            2,
            canvasHeight,
            scaleAllowance
            // 0
        );

        return () => {};
    }, []);

    return (
        <div
            style={{ ...styles.dataContainer, width: "100%" }}
            ref={barChartRef}
        >
            {/* <h3 style={styles.h3s}>Applying labels to data</h3> */}
        </div>
    );
};

const styles = {
    container: {},
    h3s: {
        color: "#fff",
    },

    dataContainer: {
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto",
    },

    fills: {
        purple: ["fill", "#8150c2"],
        blue: ["fill", "rgb(0, 0, 255)"],
    },
};

const constants = {
    colors: {
        purple: "#8150c2",
        blue: "rgb(0, 0, 255)",
        red: "#FF0033",
        gray: "#666666",
    },
};

export default Labels;
