import React, { useRef, useEffect } from "react";
import "d3-selection-multi";
import * as d3 from "d3";
import * as d3Functions from "./../../utilities/d3Functions";

const LineChart = ({ chartWidth, chartHeight, dataset }) => {
    const d3Test = useRef(null);
    const scaleAllowance = 10;

    // const [scaleX, setScaleX] = useState(()=>{})
    // const [scaleY, setScaleY] = useState(()=>{})

    const canvasWidth = 0.9 * chartWidth;
    const canvasHeight = 0.9 * chartHeight;

    // Curve the line
    // .curve(d3.curveBasis);

    useEffect(() => {
        const scaleX = d3Functions.scaleX(
            dataset,
            "month",
            canvasWidth,
            scaleAllowance
        );
        const scaleY = d3Functions.scaleY(
            dataset,
            "sales",
            canvasHeight,
            scaleAllowance
        );

        const renderLine = d3
            .line()
            .x((data, index) => {
                return scaleX(data.month);
            })
            .y((data, index) => {
                return scaleY(data.sales);
            });

        // Create the svg
        const svgCanvas = d3
            .select(d3Test.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        // Display the line chart
        const visualise = svgCanvas.append("path").attrs({
            d: renderLine(dataset),
            stroke: constants.colors.purple,
            "stroke-width": 3,
            fill: "none",
        });

        // Apply labels to the line chart
        svgCanvas
            .selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text((data, index) => {
                return data.sales;
            })
            .attrs({
                x: (data, index) => {
                    // console.log(
                    //     `Data is {sales:${data.sales}, month:${
                    //         data.month
                    //     }} max is ${chartWidth}, Scale X is ${scaleX(
                    //         data.month
                    //     )}\n\n`
                    // );

                    return scaleX(data.month);
                },
                // value above the bar
                // y: (data, index) => {
                //     return canvasHeight - data * 4 - 4;
                // },

                // value below the bar
                y: (data, index) => {
                    console.log(
                        `Data is {sales:${data.sales}, month:${
                            data.month
                        }} max is ${canvasHeight}, Scale X is ${scaleY(
                            data.sales
                        )}\n\n`
                    );

                    return scaleY(data.sales);
                },
                "font-size": 20,
                "text-anchor": "start", // start, middle or end
                dy: "1em",
                // Color matches bar
                // fill: (data, index) => {
                //     return colorPicker(data);
                // },

                // Color is white
                fill: "#fff",
            });

        // Adds dots to the points where the labels are coming from
        svgCanvas
            .selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attrs({
                cx: (data) => {
                    return scaleX(data.month);
                },
                cy: (data) => {
                    return scaleY(data.sales);
                },
                r: 3,
                fill: "#ffffff",
            });

        return () => {};
    }, []);

    return (
        <React.Fragment>
            <div
                style={{
                    ...styles.flexedDiv,
                    width: "100%",
                    // height: canvasHeight,
                }}
                ref={d3Test}
            ></div>
        </React.Fragment>
    );
};

const styles = {
    container: {},
    h3s: {
        color: "#fff",
    },
    mainDiv: {
        display: "flex",
        flexDirection: "row",
    },
    flexedDiv: {
        // padding: 20,
        // flex: 1,
        // border: "1px solid #fff",
        // height: "100%",
        // width: "100%",
        alignContent: "center",

        textAlign: "center",
    },

    fills: {
        purple: ["fill", "#8150c2"],
        blue: ["fill", "rgb(0, 0, 255)"],
    },
    colors: {
        purple: "#8150c2",
        blue: "rgb(0, 0, 255)",
        red: "#FF0033",
        gray: "#666666",
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
// export default LineChart;

export default LineChart;
