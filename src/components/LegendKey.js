import React, { useState } from "react";
import ColorBall from "./ColorBall";
const LegendKey = ({
    radius,
    color,
    kpiName,
    click,
    kpiKey,
    activeKPI,
    theme,
}) => {
    const [active, setActive] = useState(false);
    // console.log("kpiName is ", kpiName);
    const handleClick = () => {
        if (click) {
            click(kpiKey);
        }
        setActive(!active);
    };
    return (
        <div
            onClick={handleClick}
            className={
                !activeKPI.includes(kpiKey) ? "legend-key" : "bold-legend-key"
            }
            style={{
                display: "flex",
                justifyContent: "flex-start",
                fontSize: 11,
                textAlign: "left",
                marginBottom: 3,
                color: !activeKPI.includes(kpiKey)
                    ? theme === "dark"
                        ? "#fff"
                        : "#292c34"
                    : color,
            }}
            key={Math.random()}
        >
            <ColorBall color={color} radius={radius} /> <span>{kpiName}</span>
        </div>
    );
};

export default LegendKey;
