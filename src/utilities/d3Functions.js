import * as d3 from "d3";

// Dataset is an array
// Column is string
export const getMin = (dataSet, column) => {
    let minValue;
    if (column) {
        // d3.min();
        minValue = d3.min(dataSet, (datasetObj) => {
            return datasetObj[column];
        });
    } else {
        // d3.min();
        minValue = d3.min(dataSet, (datasetObj) => {
            return datasetObj;
        });
    }

    return minValue;
};

// Dataset is an array
// Column is string
export const getMax = (dataSet, column) => {
    let maxValue;
    // console.log("Dataset is", dataSet, "\nColumn is ", column);
    if (column) {
        maxValue = d3.max(dataSet, (datasetObj) => {
            // console.log("dataset obj returned is", datasetObj);
            return datasetObj[column];
        });
    } else {
        maxValue = d3.max(dataSet, (datasetObj) => {
            return datasetObj;
        });
    }

    return maxValue;
};

export const getMinMax = (dataSet, column, value, type) => {
    const maxValue = getMax(dataSet, column);

    const minValue = getMin(dataSet, column);

    const valIsMin = value === minValue;
    const valIsMax = value === maxValue;

    if (
        (type === "minAndMax" && valIsMin) ||
        (type === "minAndMax" && valIsMax)
    ) {
        return value;
    } else if (type === "min" && valIsMin) {
        return value;
    } else if (type === "max" && valIsMax) {
        return value;
    } else if (type === "all") {
        return value;
    }
};

// Dataset is an array
// Column is string
// maxWidth is the maximum available width for the svg
export const scaleX = (dataSet, column, maxWidth, allowance) => {
    const maxValue = getMax(dataSet, column);
    let minValue;
    if (allowance) {
        minValue = getMin(dataSet, column) - allowance;
    } else {
        minValue = getMin(dataSet, column);
    }

    let scale;
    if (allowance) {
        scale = d3
            .scaleLinear()
            .domain([minValue, maxValue + allowance]) // The min and max values provided for something
            .range([0, maxWidth - allowance]); // The space available e.g [0, 400]
    } else {
        scale = d3
            .scaleLinear()
            .domain([minValue, maxValue]) // The min and max values provided for something
            .range([0, maxWidth]); // The space available e.g [0, 400]
    }

    // Returns a scaling function that you can now feed values and it will place them safely within the range
    return scale;
};

// Dataset is an array
// Column is string
// maxHeight is the maximum available height for the svg
export const scaleY = (dataSet, column, maxHeight, allowance) => {
    let maxValue = getMax(dataSet, column);
    console.log("Max val is", maxValue);
    let minValue = 0;
    if (allowance) {
        minValue -= allowance;
        maxValue += allowance;
    }

    let scale;
    if (allowance) {
        scale = d3
            .scaleLinear()
            .domain([minValue, maxValue]) // The min and max values provided for something
            .range([maxHeight - allowance, allowance]); // The space available e.g [0, 400]
    } else {
        scale = d3
            .scaleLinear()
            .domain([minValue, maxValue]) // The min and max values provided for something
            .range([maxHeight, 0]); // The space available e.g [0, 400]
    }

    // Returns a scaling function that you can now feed values and it will place them safely within the range
    return scale;
};

// Dataset is an array
// Column is string
export const getMinArr = (dataSet, column) => {
    let minValue;
    if (column) {
        // d3.min();
        minValue = d3.min(dataSet, (datasetObj) => {
            return datasetObj[column];
        });
    } else {
        // d3.min();
        minValue = d3.min(dataSet, (datasetObj) => {
            return datasetObj;
        });
    }

    return minValue;
};

export const getMaxArrSmall = (dataSet, column) => {
    const maxValue = d3.max(dataSet, (datasetObj) => {
        // console.log("datasetObj is", datasetObj);
        // Get the max in the nested array
        // return parseInt(datasetObj[column]);
        const nestedMax = d3.max(datasetObj, (nestedArray) => {
            return parseInt(nestedArray[column]);
        });

        return nestedMax;
    });

    return maxValue;
};

// Dataset is an array of arrays
// Column is number (index of the values being checked)
export const getMaxArr = (dataSet, column) => {
    const maxValue = d3.max(dataSet, (datasetObj) => {
        // Get the max in the nested array

        const nestedMax = d3.max(datasetObj, (nestedArray) => {
            // console.log("nestedCOl is", nestedArray[column]);
            return parseInt(nestedArray[column]);
        });

        // console.log(
        //     "Dataset object is",
        //     datasetObj,
        //     "\n and its nested max is",
        //     nestedMax
        // );
        return nestedMax;
    });

    return maxValue;
};

// Dataset is an array of arrays
// Column is number (index of the values being checked)
// maxHeight is the maximum available height for the svg
export const scaleYArr = (dataSet, column, maxHeight, allowance) => {
    let maxValue = getMaxArr(dataSet, column);
    // console.log("Max value is", maxValue);
    let minValue = 0;
    if (allowance) {
        minValue -= allowance;
        maxValue += allowance;
    }

    // console.log("Range is", [maxHeight, 0]);
    // console.log("Domain is", [minValue, maxValue]);

    // const altVal = (val) => {
    //     return (val / maxValue) * (maxHeight / maxValue) * maxValue;
    // };

    let scale;
    if (allowance) {
        console.log(
            `There is allowance of ${allowance} ${[
                maxHeight - allowance,
                allowance,
            ]}`
        );
        scale = d3
            .scaleLinear()
            .domain([minValue, maxValue]) // The min and max values provided for something
            .range([allowance, maxHeight - allowance]); // The space available e.g [0, 400]
    } else {
        // console.log("No allowance");
        scale = d3
            .scaleLinear()
            .domain([minValue, maxValue]) // The min and max values provided for something
            .range([maxHeight, 0]); // The space available e.g [0, 400]
    }

    // Returns a scaling function that you can now feed values and it will place them safely within the range
    // return altVal;
    return scale;
};

export const scaleYArrSmall = (dataSet, column, maxHeight, allowance) => {
    let maxValue = getMaxArrSmall(dataSet, column);
    // console.log("Max value is", maxValue);
    let minValue = 0;
    if (allowance) {
        minValue -= allowance;
        maxValue += allowance;
    }
    let scale;
    if (allowance) {
        scale = d3
            .scaleLinear()
            .domain([maxValue, minValue]) // The min and max values provided for something
            .range([allowance, maxHeight - allowance]); // The space available e.g [0, 400]
    } else {
        scale = d3
            .scaleLinear()
            .domain([minValue, maxValue]) // The min and max values provided for something
            .range([maxHeight, 0]); // The space available e.g [0, 400]
    }
    return scale;
};

export const scaleUpMapPart1 = (mapToUse, canvasHeight, canvasWidth) => {
    let centerMap = d3.geoCentroid(mapToUse);
    let scale = 150;
    let offset = [canvasWidth / 2, canvasHeight / 2];

    let mapProjection = d3
        .geoMercator()
        .scale(scale)
        .center(centerMap)
        .translate(offset);
    let firstPath = d3.geoPath().projection(mapProjection);
    return firstPath;
};

export const scaleUpMapPart2 = (
    mapToUse,
    canvasHeight,
    canvasWidth,
    firstPath,
    oldScale,
    oldOffset,
    centerMap
) => {
    // using the first path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    let bounds = firstPath.bounds(mapToUse);
    let hScale = (oldScale * canvasWidth) / (bounds[1][0] - bounds[0][0]);
    let vScale = (oldScale * canvasHeight) / (bounds[1][1] - bounds[0][1]);
    oldScale = hScale < vScale ? hScale : vScale;
    oldOffset = [
        canvasWidth - (bounds[0][0] + bounds[1][0]) / 2,
        canvasHeight - (bounds[0][1] + bounds[1][1]) / 2,
    ];

    // new projection
    let mapProjection = d3
        .geoMercator()
        .center(centerMap)
        .scale(oldScale)
        .translate(oldOffset);
    let finalPath = firstPath.projection(mapProjection);
    return finalPath;
};
