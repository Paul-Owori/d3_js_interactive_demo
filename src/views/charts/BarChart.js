import React, { useRef, useEffect } from "react";
import "d3-selection-multi";
import * as d3 from "d3";
import * as d3Functions from "./../../utilities/d3Functions";

const Labels = ({ chartWidth, chartHeight, dataset }) => {
    const d3Test = useRef(null);
    const scaleAllowance = 10;

    // Svg
    const canvasWidth = 0.9 * chartWidth;
    const canvasHeight = 0.9 * chartHeight;
    const padding = 2;
    const textVerticalPadding = 18;

    useEffect(() => {
        return () => {};
    }, []);

    const colorPicker = (value) => {
        // Return a plain gray for low values and a bright red for higher values
        // This is an example of a key performance indicator
        if (value <= 20) {
            return constants.colors.gray;
        } else {
            return constants.colors.red;
        }
    };

    useEffect(() => {
        //  Set the x and y scales
    }, []);

    useEffect(() => {
        const svgCanvas = d3
            .select(d3Test.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        const scaleX = d3Functions.scaleX(
            dataset,
            null,
            canvasWidth,
            scaleAllowance
        );
        const scaleY = d3Functions.scaleY(
            dataset,
            null,
            canvasHeight,
            scaleAllowance
        );

        svgCanvas
            .selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attrs({
                x: (data, index) => {
                    return index * (canvasWidth / dataset.length);
                },
                y: (data, index) => {
                    let altPos = scaleY(data);
                    let currPos = canvasHeight - data * 4;

                    return altPos;
                },
                width: (data, index) => {
                    return canvasWidth / dataset.length - padding;
                },
                height: (data, index) => {
                    return canvasHeight - scaleY(data);
                    // return scaleY(data);
                },
            })
            .style("fill", (data, index) => {
                return colorPicker(data);
            });

        // Apply labels
        svgCanvas
            .selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text((data, index) => {
                return data;
            })
            .attrs({
                "text-anchor": "middle",
                x: (data, index) => {
                    return (
                        (canvasWidth / dataset.length - padding) / 2 +
                        (index * canvasWidth) / dataset.length
                    );
                },
                // value above the bar
                // y: (data, index) => {
                //     return canvasHeight - data * 4 - 4;
                // },

                // value below the bar
                y: (data, index) => {
                    const position = scaleY(data) + textVerticalPadding;
                    return position < canvasHeight
                        ? position
                        : canvasHeight - padding;
                },
                "font-size": 20,
                // Color matches bar
                // fill: (data, index) => {
                //     return colorPicker(data);
                // },

                // Color is white
                fill: "#fff",
            });
        return () => {};
    }, []);

    return (
        <div style={{ ...styles.dataContainer, width: "100%" }} ref={d3Test}>
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
