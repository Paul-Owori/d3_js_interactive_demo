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

    if (column) {
        maxValue = d3.max(dataSet, (datasetObj) => {
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
