import React from "react";
const ColorBall = ({ radius, color }) => {
    return (
        <div>
            <div
                style={{
                    width: radius,
                    height: radius,
                    background: color,
                    borderRadius: radius / 2,
                    margin: 3,
                }}
            ></div>
        </div>
    );
};

export default ColorBall;
