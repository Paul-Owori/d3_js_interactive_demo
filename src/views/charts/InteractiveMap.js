import React, { useRef, useEffect, useState } from "react";
import "d3-selection-multi";
import * as d3 from "d3";
import * as d3Functions from "../../utilities/d3Functions";
import { rewind as turfRewind, simplify as turfSimplify } from "@turf/turf";
import { feature as topoFeature } from "topojson-client";
// turf.re

const InteractiveMap = ({
    chartWidth,
    chartHeight,
    mapJson,
    selectRegion,
    ug2Dist,
    districtsJson,
    topoJson,
}) => {
    // console.log(
    //     "Topojson is",
    //     topoJson.objects.DISTRICTS_2018_UTM_36N.geometries
    // );
    // console.log(this);

    const [selectedDistID, setSelectedDistID] = useState("");
    const [storedSvg, setStoredSvg] = useState("");
    const mapToUse = mapJson;
    const secondMap = false; //ug2json;
    const rewindMap = true;
    const rewindSecondMap = true;
    const mapRef = useRef(null);
    const tempStore = useRef(null);

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
        return colors[id];
    };

    function selecting(id) {
        console.log("Selecting", id);
        setSelectedDistID(`${id}`);
    }

    useEffect(() => {
        if (rewindMap) {
            // console.log("rewinding ", mapToUse);
            mapToUse.features.forEach(function (feature) {
                feature.geometry = turfRewind(feature.geometry, {
                    reverse: true,
                });
            });
        }
        if (rewindSecondMap && secondMap) {
            secondMap.features.forEach(function (feature) {
                feature.geometry = turfRewind(feature.geometry, {
                    reverse: true,
                });
            });
        }

        let centerMap = d3.geoCentroid(mapToUse);
        let scale = 30;
        let offset = [canvasWidth / 2, canvasHeight / 2];
        let mapProjection = d3
            .geoMercator()
            .scale(scale)
            .center(centerMap)
            .translate(offset);

        // const mapProjection = d3
        //     .geoIdentity()
        //     .fitExtent([canvasWidth, canvasHeight], mapToUse)
        // .reflectY(true);

        let mapPath = d3.geoPath().projection(mapProjection);

        // using the path determine the bounds of the current map and use
        // these to determine better values for the scale and translation
        let bounds = mapPath.bounds(mapToUse);
        let hScale = (scale * canvasWidth) / (bounds[1][0] - bounds[0][0]);
        let vScale = (scale * canvasHeight) / (bounds[1][1] - bounds[0][1]);
        scale = hScale < vScale ? hScale : vScale;
        offset = [
            canvasWidth - (bounds[0][0] + bounds[1][0]) / 2,
            canvasHeight - (bounds[0][1] + bounds[1][1]) / 2,
        ];

        // new projection
        mapProjection = d3
            .geoMercator()
            .center(centerMap)
            .scale(scale)
            .translate(offset);
        mapPath = mapPath.projection(mapProjection);

        const svgCanvas = d3
            .select(mapRef.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        svgCanvas
            .selectAll("path")
            .data(mapToUse.features)
            .enter()
            .append("path")
            .attrs({
                d: (data) => {
                    // console.log("A feature is", data);
                    return mapPath(data);
                },
                stroke: "#000",
                "stroke-width": 0.5,
                fill: "#939393",
            })
            .on("mouseover", function (d) {
                // console.log("THIS IS", this);
                d3.select(this).style("fill", "#1a1b1d");

                // d3.selectAll("path").style("fill", (d) => {
                //     // "#1a1b1d"
                //     if (`${d.id}` === `${tempStore.current.innerText}`) {
                //         d3.select(this).style("fill", "#1a1b1d");
                //     } else {
                //         d3.select(this).style("fill", "#939393");
                //     }
                // });
            })
            .on("mouseout", function (d) {
                // console.log("Leaving This=>", d.id);
                // console.log(
                //     `${d.id} !== ${selectedDistID} is ${
                //         d.id !== selectedDistID
                //     }`
                // );
                console.log("selectedDistID=>", selectedDistID);
                if (`${d.id}` !== `${tempStore.current.innerText}`) {
                    d3.select(this).style("fill", "#939393");
                }
            })
            .on("click", (d) => {
                console.log("TEMPSTORE IS", tempStore.current.innerText);
                // d3.select(tempStore.current).text(d.id);
                selectRegion(d.id);
                // console.log("Clicked!");
                // console.log("Selected=>", d.id);
                // selecting(d.id);
                // console.log("This is", that);
                // d3.select(this).style("fill", "#939393");
            })
            .append("title")
            .text((d) => {
                if (d.properties.NL_name) {
                    return d.properties.NL_name.replace("District ", "");
                } else {
                    return "The rest of Uganda";
                }
            });
        return () => {};
    }, []);

    // useEffect(() => {
    //     // console.log(Object.keys(mapToUse));
    //     const size = 500;
    //     const options = { tolerance: 0.01, highQuality: false };
    //     const districts = turfSimplify(districtsJson, options);
    //     const mapToUse = districts;
    //     // const featureCollection = topoFeature(
    //     //     topoJson,
    //     //     topoJson.objects.DISTRICTS_2018_UTM_36N
    //     // );
    //     console.log("mapto use is", mapToUse);
    //     const bounds = d3.geoBounds(mapToUse);
    //     console.log("Bounds are", bounds);

    //     const centerX =
    //             d3.sum(bounds, function (d) {
    //                 return d[0];
    //             }) / 2,
    //         centerY =
    //             d3.sum(bounds, function (d) {
    //                 return d[1];
    //             }) / 2;

    //     const projection2 = d3
    //         .geoMercator()
    //         .scale(3000)
    //         .center([centerX, centerY]);
    //     // const districts = simplified

    //     let centerMap = d3.geoCentroid(mapToUse);
    //     let scale = 30;
    //     let offset = [canvasWidth / 2, canvasHeight / 2];
    //     let mapProjection = d3
    //         .geoMercator()
    //         .scale(scale)
    //         .center(centerMap)
    //         .translate(offset);

    //     // const mapProjection = d3
    //     //     .geoIdentity()
    //     //     .fitExtent([canvasWidth, canvasHeight], mapToUse)
    //     // .reflectY(true);

    //     let mapPath = d3.geoPath().projection(mapProjection);

    //     // console.log("districts are", districts);
    //     // const mapProjection = d3.geoMercator();
    //     // const pathGenerator = d3.geoPath().projection(mapProjection);

    //     const svgCanvas = d3
    //         .select(mapRef.current)
    //         .append("svg")
    //         .attr("width", canvasWidth)
    //         .attr("height", canvasHeight);

    //     const paths = svgCanvas.selectAll("path").data(mapToUse.features);

    //     paths
    //         .enter()
    //         .append("path")
    //         .attr("d", (feat) => {
    //             console.log("Feat is", feat);
    //             let pathFeat = mapPath(feat);
    //             console.log("path feat is", pathFeat);
    //             return pathFeat;
    //         });

    //     // d3.selectAll("svg").attr("transform", "scale(2)");
    //     // d3.geoConicConformal()
    //     //     .center([2.454071, 46.279229])
    //     //     .scale(3000)
    //     //     .translate([canvasWidth / 2, canvasHeight / 2]);
    //     // .attr("transform", "scale(2)");
    //     return () => {};
    // }, []);

    // useEffect(() => {

    //     let secondCenterMap = d3.geoCentroid(secondMap);
    //     let secondMapScale = 150;
    //     let secondMapOffset = [canvasWidth / 2, canvasHeight / 2];
    //     let secondMapProj = d3
    //         .geoMercator()
    //         .scale(secondMapScale)
    //         .center(secondCenterMap)
    //         .translate(secondMapOffset);

    //     // const secondMapProj = d3
    //     //     .geoIdentity()
    //     //     .fitExtent([canvasWidth, canvasHeight], secondMap)
    //     // .reflectY(true);

    //     let secondMapPath = d3.geoPath().projection(secondMapProj);

    //     // using the path determine the bounds of the current map and use
    //     // these to determine better values for the scale and translation
    //     let secondMapBounds = secondMapPath.bounds(secondMap);
    //     let secondMapHScale = (secondMapScale * canvasWidth) / (secondMapBounds[1][0] - secondMapBounds[0][0]);
    //     let secondMapVScale = (secondMapScale * canvasHeight) / (secondMapBounds[1][1] - secondMapBounds[0][1]);
    //     secondMapScale = secondMapHScale < secondMapVScale ? secondMapHScale : secondMapVScale;
    //     secondMapOffset = [
    //         canvasWidth - (secondMapBounds[0][0] + secondMapBounds[1][0]) / 2,
    //         canvasHeight - (secondMapBounds[0][1] + secondMapBounds[1][1]) / 2,
    //     ];

    //     // new projection
    //     secondMapProj = d3
    //         .geoMercator()
    //         .center(secondCenterMap)
    //         .scale(secondMapScale)
    //         .translate(secondMapOffset);
    //     // secondMapPath = secondMapPath.projection(secondMapProj);

    //     const svgCanvas = d3
    //         .select(mapRef.current)
    //         .append("svg")
    //         .attr("width", canvasWidth)
    //         .attr("height", canvasHeight);

    //     svgCanvas
    //         .selectAll("path")
    //         .data(secondMap.features)
    //         .enter()
    //         .append("path")
    //         .attr("d", secondMapPath)
    //         .attr("fill", "#fff");

    //     // d3.selectAll("svg").attr("transform", "scale(2)");
    //     // d3.geoConicConformal()
    //     //     .center([2.454071, 46.279229])
    //     //     .scale(3000)
    //     //     .translate([canvasWidth / 2, canvasHeight / 2]);
    //     // .attr("transform", "scale(2)");
    //     return () => {};
    // }, [storedSvg]);

    return (
        <div
            id={"interactiveMap"}
            style={{ ...styles.dataContainer, width: "100%" }}
            ref={mapRef}
        >
            <p ref={tempStore} style={styles.tempStore}></p>
            <h3 style={styles.h3s}>
                Distribution of Immunisation doses countrywide
            </h3>
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
    tempStore: { display: "none" },
};

const constants = {
    colors: {
        purple: "#8150c2",
        blue: "rgb(0, 0, 255)",
        red: "#FF0033",
        gray: "#666666",
    },
};

export default InteractiveMap;

/**
    useEffect(() => {
        console.log(Object.keys(mapToUse));
        // const size = 500;
        // const mapProjection = d3
        //     .geoAlbersUsa()
        //     .translate([size / 2, size / 2])
        //     .scale([10000]);

        // const mapProjection = d3.geoMercator()//.fitWidth(canvasWidth);
        // mapProjection.fitWidth(canvasWidth);

        // mapProjection.scale(size);
        // mapProjection.translate([size / 2, size / 2]);
        // d3.json().then(result=>{}).catch(err=>console.log(err))
        let centerMap = d3.geoCentroid(mapToUse);
        let scale = 150;
        let offset = [canvasWidth / 2, canvasHeight / 2];
        let mapProjection = d3
            .geoMercator()
            .scale(scale)
            .center(centerMap)
            .translate(offset);
        let mapPath = d3.geoPath().projection(mapProjection);

        // using the path determine the bounds of the current map and use
        // these to determine better values for the scale and translation
        let bounds = mapPath.bounds(mapToUse);
        let hScale = (scale * canvasWidth) / (bounds[1][0] - bounds[0][0]);
        let vScale = (scale * canvasHeight) / (bounds[1][1] - bounds[0][1]);
        scale = hScale < vScale ? hScale : vScale;
        offset = [
            canvasWidth - (bounds[0][0] + bounds[1][0]) / 2,
            canvasHeight - (bounds[0][1] + bounds[1][1]) / 2,
        ];

        // new projection
        mapProjection = d3
            .geoMercator()
            .center(centerMap)
            .scale(scale)
            .translate(offset);
        mapPath = mapPath.projection(mapProjection);

        const svgCanvas = d3
            .select(mapRef.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        svgCanvas
            .selectAll("path")
            .data(mapToUse.features)
            .enter()
            .append("path")
            .attr("d", mapPath);
        // .attr("fill", "#939393");

        // d3.selectAll("svg").attr("transform", "scale(2)");
        // d3.geoConicConformal()
        //     .center([2.454071, 46.279229])
        //     .scale(3000)
        //     .translate([canvasWidth / 2, canvasHeight / 2]);
        // .attr("transform", "scale(2)");
        return () => {};
    }, []);
 */

// Second working instance
/**
  * 
  *  if (rewindMap) {
            mapToUse.features.forEach(function (feature) {
                feature.geometry = turfRewind(feature.geometry, {
                    reverse: true,
                });
            });
        }
        if (rewindSecondMap && secondMap) {
            secondMap.features.forEach(function (feature) {
                feature.geometry = turfRewind(feature.geometry, {
                    reverse: true,
                });
            });
        }

        let centerMap = d3.geoCentroid(mapToUse);
        let scale = 30;
        let offset = [canvasWidth / 2, canvasHeight / 2];
        let mapProjection = d3
            .geoMercator()
            .scale(scale)
            .center(centerMap)
            .translate(offset);

        // const mapProjection = d3
        //     .geoIdentity()
        //     .fitExtent([canvasWidth, canvasHeight], mapToUse)
        // .reflectY(true);

        let mapPath = d3.geoPath().projection(mapProjection);

        // using the path determine the bounds of the current map and use
        // these to determine better values for the scale and translation
        let bounds = mapPath.bounds(mapToUse);
        let hScale = (scale * canvasWidth) / (bounds[1][0] - bounds[0][0]);
        let vScale = (scale * canvasHeight) / (bounds[1][1] - bounds[0][1]);
        scale = hScale < vScale ? hScale : vScale;
        offset = [
            canvasWidth - (bounds[0][0] + bounds[1][0]) / 2,
            canvasHeight - (bounds[0][1] + bounds[1][1]) / 2,
        ];

        // new projection
        mapProjection = d3
            .geoMercator()
            .center(centerMap)
            .scale(scale)
            .translate(offset);
        mapPath = mapPath.projection(mapProjection);

        const svgCanvas = d3
            .select(mapRef.current)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight);

        svgCanvas
            .selectAll("path")
            .data(mapToUse.features)
            .enter()
            .append("path")
            .attrs({
                d: mapPath,
                stroke: "#000",
                "stroke-width": 0.5,
                fill: "#939393",
            });



             if (secondMap) {
            let secondCenterMap = d3.geoCentroid(secondMap);
            let secondMapScale = 150;
            let secondMapOffset = [canvasWidth / 2, canvasHeight / 2];
            let secondMapProj = d3
                .geoMercator()
                .scale(secondMapScale)
                .center(secondCenterMap)
                .translate(secondMapOffset);

            // const secondMapProj = d3
            //     .geoIdentity()
            //     .fitExtent([canvasWidth, canvasHeight], secondMap)
            // .reflectY(true);

            let secondMapPath = d3.geoPath().projection(secondMapProj);

            // using the path determine the bounds of the current map and use
            // these to determine better values for the scale and translation
            let secondMapBounds = secondMapPath.bounds(secondMap);
            let secondMapHScale =
                (secondMapScale * canvasWidth) /
                (secondMapBounds[1][0] - secondMapBounds[0][0]);
            let secondMapVScale =
                (secondMapScale * canvasHeight) /
                (secondMapBounds[1][1] - secondMapBounds[0][1]);
            secondMapScale =
                secondMapHScale < secondMapVScale
                    ? secondMapHScale
                    : secondMapVScale;
            secondMapOffset = [
                canvasWidth -
                    (secondMapBounds[0][0] + secondMapBounds[1][0]) / 2,
                canvasHeight -
                    (secondMapBounds[0][1] + secondMapBounds[1][1]) / 2,
            ];

            // new projection
            secondMapProj = d3
                .geoMercator()
                .center(secondCenterMap)
                .scale(secondMapScale)
                .translate(secondMapOffset);

            svgCanvas
                .selectAll("path")
                .data(secondMap.features)
                .enter()
                .append("path")
                .attr("d", secondMapPath)
                .attr("fill", "#fff");
        }
  */
