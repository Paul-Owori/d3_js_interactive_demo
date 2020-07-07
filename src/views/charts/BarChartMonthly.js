import React, { useRef, useEffect, useState } from "react";
import "d3-selection-multi";
import * as d3 from "d3";
import * as d3Functions from "./../../utilities/d3Functions";

const BarChartMonthly = ({
    chartWidth,
    chartHeight,
    dataset,
    monthCode,
    activeKPI,
    itemKey,
    handleActiveKPI,
}) => {
    const barChartRef = useRef(null);
    const scaleAllowance = 1;
    const fadedOpacity = 0.2;
    const [sortedData, setSortedData] = useState("");
    const [initialRenderDone, setInitialRenderDone] = useState(false);
    const [fadeFunc, setFadeFunc] = useState(() => {
        console.log("Nope");
    });

    // Svg
    const [canvas, setCanvas] = useState("");
    const canvasWidth = 0.9 * chartWidth;
    const canvasHeight = 0.9 * chartHeight;
    const padding = 2;
    const textVerticalPadding = 18;

    const getSegmentName = (id) => {
        return dataset.kPIValues.find((obj) => obj.uid === id).name;
    };

    useEffect(() => {
        return () => {};
    }, []);

    const colorPicker = (colors, id) => {
        // console.log("DATA IS", id);
        return colors[id];
    };

    const getMonthData = (code) => {
        // console.log(
        //     `Getting months data for month ${code} from:`,
        //     dataset.dataSets
        // );
        const info = dataset.dataSets.filter((obj) => obj[1] === code);
        // console.log(`Month ${code} is:`, info);

        return info;
    };

    const renderBars = () => {
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
        setSortedData(sortedDatasets);

        const svgCanvas = d3
            .select(barChartRef.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        console.log("svgCanvas is ", svgCanvas);
        setCanvas(svgCanvas);

        const scaleY = d3Functions.scaleYArrSmall(
            arrayByMonth,
            2,
            canvasHeight,
            scaleAllowance
            // 0
        );

        svgCanvas
            .selectAll("rect")
            .data(sortedDatasets)
            .enter()
            .append("rect")
            .attrs({
                opacity: (data, index) => {
                    if (
                        activeKPI &&
                        activeKPI.length &&
                        !activeKPI.includes(data[0])
                    ) {
                        console.log("Not included");
                        return fadedOpacity;
                    } else {
                        console.log(
                            "activeKPI.includes(data[0])",
                            activeKPI.includes(data[0])
                        );
                        return 1;
                    }
                },
                x: (data, index) => {
                    const length = arrayByMonth.length * arrayByMonth[0].length;
                    // console.log("Data is", length);
                    return index * (canvasWidth / length);
                },
                y: (data, index) => {
                    let altPos = scaleY(data[2]);
                    return altPos;
                },
                width: (data, index) => {
                    const length = arrayByMonth.length * arrayByMonth[0].length;
                    return canvasWidth / length - padding;
                },
                height: (data, index) => {
                    return canvasHeight - scaleY(data[2]);
                },
            })
            .on("mouseover", function (d) {
                // make all bars opaque
                if (!activeKPI.length) {
                    fade(fadedOpacity, d);
                }
            })
            .on("mouseout", function (d) {
                if (!activeKPI.length) {
                    fade(1, d);
                }
            })
            .on("click", function (d) {
                if (d) {
                    // console.log("D IS", d[0]);
                    handleActiveKPI(d[0]);
                }
            })
            // .transition()
            // .delay(function (d, i) {
            //     return (1 + i) * 300;
            // })
            // .duration(1000)
            .style("fill", (data, index) => {
                return colorPicker(dataset.colors, data[0]);
            })
            .append("title")
            .text((d) => {
                // console.log("Data is", d);
                const id = d[0];
                // const val = d.data[2];
                const actualName = getSegmentName(id);
                return `${actualName}`;
            });

        const fade = (opacity, d) => {
            // console.log("CANVAS IS", canvas);
            svgCanvas
                .selectAll("rect")
                // .data(sortedData)
                // .enter()
                .filter(function (item) {
                    if (d && item) {
                        return item[0] !== d[0];
                    }
                })
                .transition()
                .style("opacity", opacity);
        };

        svgCanvas
            .selectAll("text")
            .data(sortedDatasets)
            .enter()
            .append("text")
            .text((data, index) => {
                return data[2];
            })
            .attrs({
                "text-anchor": "middle",
                x: (data, index) => {
                    const length = arrayByMonth.length * arrayByMonth[0].length;
                    let startOfBar = index * (canvasWidth / length);
                    let barWidth = canvasWidth / length - padding;

                    return startOfBar + 0.5 * barWidth;
                },

                // value below the bar
                y: (data, index) => {
                    let position = scaleY(data[2]) + textVerticalPadding;

                    return position < canvasHeight
                        ? position
                        : canvasHeight - padding;
                },
                "font-size": (data, index) => {
                    const length = arrayByMonth.length * arrayByMonth[0].length;

                    let barWidth = canvasWidth / length - padding;

                    return 0.8 * barWidth;
                },
                "font-weight": "bold",

                fill: "#fff",
            });

        setFadeFunc(fade);
    };
    useEffect(() => {
        renderBars();
        setInitialRenderDone(true);
        return () => {};
    }, []);

    useEffect(() => {
        if (!initialRenderDone) {
            return;
        }
        renderBars();
        return () => {};
    }, [itemKey]);

    useEffect(() => {
        if (!initialRenderDone) {
            return;
        }
        console.log("\n\nData set changed\n\n");
        renderBars();
        return () => {};
    }, [dataset]);

    return (
        <div
            key={itemKey}
            style={{ ...styles.dataContainer, width: "100%" }}
            ref={barChartRef}
        >
            <h6>Number of doses per Key Performance Indicator in a month</h6>
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

export default BarChartMonthly;
