import React, { useRef, useEffect, useState } from "react";
import "d3-selection-multi";
import * as d3 from "d3";
import * as d3Functions from "../../utilities/d3Functions";

const PieChart = ({
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
    const [sortedData, setSortedData] = useState("");
    const [initialRenderDone, setInitialRenderDone] = useState(false);

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

    const getSegmentName = (id) => {
        return dataset.kPIValues.find((obj) => obj.uid === id).name;
    };

    const renderPI = () => {
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

        setSortedData(arrayByMonth);

        const svgCanvas = d3
            .select(barChartRef.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        const pieData = d3
            .pie()
            .sort(null)
            .value((dataObj) => {
                return dataObj[2];
            })(sortedDatasets);

        const innerRadiusNum = canvasHeight / 25;
        const outerRadiusNum = canvasHeight / 2.6;
        const expandedInnerRadius = innerRadiusNum + 0.2 * innerRadiusNum;
        const expandedOuterRadius = outerRadiusNum + 0.2 * outerRadiusNum;

        const onArcHover = d3
            .arc()
            .innerRadius(expandedInnerRadius)
            .outerRadius(expandedOuterRadius);

        const pieSegments = d3
            .arc()
            .innerRadius((d) => {
                if (activeKPI.includes(d.data[0])) {
                    return expandedInnerRadius;
                } else {
                    return innerRadiusNum;
                }
            })
            .outerRadius((d) => {
                if (activeKPI.includes(d.data[0])) {
                    return expandedOuterRadius;
                } else {
                    return outerRadiusNum;
                }
            })
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
            })
            .style("fill", (data, index) => {
                return colorPicker(dataset.colors, data.data[0]);
            })
            .on("mouseover", function (d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", onArcHover);
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", pieSegments);
            })
            .on("click", (d) => {
                handleActiveKPI(d.data[0]);
                // console.log("DDDD ISSS", d);
            })
            .append("title")
            .text((d) => {
                // console.log("d is", dataset);
                const id = d.data[0];
                const val = d.data[2];
                const actualName = getSegmentName(id);
                return `[${val}] : ${actualName}`;
            });

        const content = d3.select("g").selectAll("text").data(sortedDatasets);
    };

    useEffect(() => {
        renderPI();
        setInitialRenderDone(true);
        return () => {};
    }, []);

    useEffect(() => {
        if (!initialRenderDone) {
            return;
        }
        renderPI();
        return () => {};
    }, [itemKey]);

    return (
        <div
            style={{ ...styles.dataContainer, width: "100%" }}
            ref={barChartRef}
            key={itemKey}
        >
            <h6 style={{ margin: "0rem" }}>
                Number of doses per Key Performance Indicator in a month
            </h6>{" "}
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

export default PieChart;
