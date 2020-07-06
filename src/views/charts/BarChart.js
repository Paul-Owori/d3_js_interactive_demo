import React, { useRef, useEffect, useState } from "react";
import "d3-selection-multi";
import * as d3 from "d3";
import * as d3Functions from "./../../utilities/d3Functions";

const Labels = ({ chartWidth, chartHeight, dataset }) => {
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
        // console.log("DATA IS", id);
        return colors[id];
    };

    useEffect(() => {
        console.log("!!!!!");
        //  Set the x and y scales
    }, []);

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
            let monthArray = getMonthData(dataset.months[r].code);
            arrayByMonth.push(monthArray);
            sortedDatasets = [...sortedDatasets, ...monthArray];
        }

        setSortedData(arrayByMonth);

        // const month1 = dataset.months[0].code;
        // getMonthData(month1);
        // console.log("arrayByMonth is", arrayByMonth);
        // const month1DataSet = month1.

        // Good to go.
        const svgCanvas = d3
            .select(barChartRef.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        // const scaleX = d3Functions.scaleX(
        //     dataset,
        //     null,
        //     canvasWidth,
        //     scaleAllowance
        // );

        const scaleY = d3Functions.scaleYArr(
            arrayByMonth,
            2,
            canvasHeight,
            scaleAllowance
            // 0
        );

        // console.log(
        //     "ScaleY 13 is",
        //     scaleY(13),
        //     "Canvas height is",
        //     canvasHeight
        // );
        console.log("Datsets", dataset.dataSets);
        console.log("Array by month", sortedDatasets);

        svgCanvas
            .selectAll("rect")
            .data(sortedDatasets)
            .enter()
            .append("rect")
            .attrs({
                x: (data, index) => {
                    const length = arrayByMonth.length * arrayByMonth[0].length;
                    // console.log("Data is", length);
                    return index * (canvasWidth / length);
                },
                y: (data, index) => {
                    let altPos = scaleY(data[2]);
                    let currPos = canvasHeight - data * 4;
                    return altPos;
                },
                width: (data, index) => {
                    const length = arrayByMonth.length * arrayByMonth[0].length;
                    return canvasWidth / length - padding;
                },
                height: (data, index) => {
                    return canvasHeight - scaleY(data[2]);
                    // return scaleY(data);
                },
            })
            .style("fill", (data, index) => {
                return colorPicker(dataset.colors, data[0]);
            });

        // Apply labels
        // svgCanvas
        //     .selectAll("text")
        //     .data(dataset)
        //     .enter()
        //     .append("text")
        //     .text((data, index) => {
        //         return data;
        //     })
        //     .attrs({
        //         "text-anchor": "middle",
        //         x: (data, index) => {
        //             return (
        //                 (canvasWidth / dataset.length - padding) / 2 +
        //                 (index * canvasWidth) / dataset.length
        //             );
        //         },
        //         // value above the bar
        //         // y: (data, index) => {
        //         //     return canvasHeight - data * 4 - 4;
        //         // },

        //         // value below the bar
        //         y: (data, index) => {
        //             const position = scaleY(data) + textVerticalPadding;
        //             return position < canvasHeight
        //                 ? position
        //                 : canvasHeight - padding;
        //         },
        //         "font-size": 20,
        //         // Color matches bar
        //         // fill: (data, index) => {
        //         //     return colorPicker(data);
        //         // },

        //         // Color is white
        //         fill: "#fff",
        //     });
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
        alignContent: "center",
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
