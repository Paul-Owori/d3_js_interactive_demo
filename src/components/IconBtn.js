import React, { useState, useEffect } from "react";

// "africa"
import africa_bw from "./../assets/icons/africa_bw.svg";
import africa_color from "./../assets/icons/africa_color.svg";

// "bar_graph"
import bar_graph_bw from "./../assets/icons/bar_graph_bw.svg";
import bar_graph_color from "./../assets/icons/bar_graph_color.svg";

// "bar_graph_pretty"
import bar_graph_pretty_bw from "./../assets/icons/bar_graph_pretty_bw.svg";
import bar_graph_pretty_color from "./../assets/icons/bar_graph_pretty_color.svg";

// "graph_and_plot"
import graph_and_plot_bw from "./../assets/icons/graph_and_plot_bw.svg";
import graph_and_plot_color from "./../assets/icons/graph_and_plot_color.svg";

// "graph"
import graph_bw from "./../assets/icons/graph_bw.svg";
import graph_color from "./../assets/icons/graph_color.svg";

// "line_plot"
import line_plot_bw from "./../assets/icons/line_plot_bw.svg";
import line_plot_color from "./../assets/icons/line_plot_color.svg";

// "pie_chart"
import pie_chart_bw from "./../assets/icons/pie-chart_bw.svg";
import pie_chart_color from "./../assets/icons/pie-chart_color.svg";

// "scatter"
import scatter_bw from "./../assets/icons/scatter_bw.svg";
import scatter_color from "./../assets/icons/scatter_color.svg";

const IconBtn = ({ icon, size, altStyles, bw, darkBg, onClick, margin }) => {
    const [determinedSrc, setDeterminedSrc] = useState("");
    const [typeAsString, setTypeAsString] = useState("");
    const allIcons = {
        africa: { bw: africa_bw, color: africa_color },
        bar_graph: { bw: bar_graph_bw, color: bar_graph_color },
        bar_graph_pretty: {
            bw: bar_graph_pretty_bw,
            color: bar_graph_pretty_color,
        },
        graph_and_plot: { bw: graph_and_plot_bw, color: graph_and_plot_color },
        graph: { bw: graph_bw, color: graph_color },
        line_plot: { bw: line_plot_bw, color: line_plot_color },
        pie_chart: { bw: pie_chart_bw, color: pie_chart_color },
        scatter: { bw: scatter_bw, color: scatter_color },
    };

    const determineType = (name, monochrome) => {
        if (!allIcons[name]) {
            return { default: "" };
        } else {
            if (monochrome) {
                return allIcons[name]["bw"];
            } else {
                return allIcons[name]["color"];
            }
        }
    };

    useEffect(() => {
        if (typeAsString === icon) {
            return;
        }
        renderIcon();
        return () => {};
    }, [icon]);

    useEffect(() => {
        renderIcon();

        return () => {};
    }, [bw]);

    const renderIcon = () => {
        let type = determineType(icon, bw);

        setDeterminedSrc(type);
        setTypeAsString(icon);
    };

    const clickHandler = () => {
        renderIcon();
        onClick();
    };

    return (
        <div
            onClick={clickHandler}
            className="icon-btn"
            style={{
                borderRadius: 0.7 * size + (1 * size) / 2,
                width: size + 0.7 * size,
                height: size + 0.7 * size,
                background: bw ? "#dfe1e6" : "#000",
                border: !bw ? "3px solid #fff" : "3px solid #000",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                margin: margin || 0.3 * size,
            }}
        >
            {determinedSrc && (
                <img src={determinedSrc} alt={icon} width={size} />
            )}
        </div>
    );
};

const styles = {
    iconContainer: {},
};

export default IconBtn;
