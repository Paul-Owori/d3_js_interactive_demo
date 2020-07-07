import React, { Component, useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import isEqual from "lodash.isequal";

// Data
import generalMetadata from "./../assets/datasets/metadata.json";
import generalHeaders from "./../assets/datasets/headers.json";
import lphMetadata from "./../assets/datasets/orgUnits/lph_metadata.json";
import lphHeaders from "./../assets/datasets/orgUnits/lph_headers.json";
import mtshHeaders from "./../assets/datasets/orgUnits/mtsh_headers.json";
import mtshMetadata from "./../assets/datasets/orgUnits/mtsh_metadata.json";
import ugandaJson from "../assets/geodata/uganda.json";

// Assets
import Colors from "./../assets/colors/colors";
import kpiNames from "./../assets/key_performance_indicators/kpi";

// Hooks
import useWindowDimensions from "./../hooks/windowDimensions";

// Components
import IconBtn from "./../components/IconBtn";
import LegendKey from "./../components/LegendKey";

// Charts
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/Piechart";
import BarChartMonthly from "./charts/BarChartMonthly";
import InteractiveMap from "./charts/InteractiveMap";

const lphObj = {
    metaInput: lphMetadata,
    headers: lphHeaders,
};
const generalObj = {
    metaInput: generalMetadata,
    headers: generalHeaders,
};
const mtshObj = {
    metaInput: mtshMetadata,
    headers: mtshHeaders,
};
const activeDataTypes = {
    general: ["uganda.0", "district.12", "district.56"],
    lph: ["district.20", "district.17", "district.43"],
    mtsh: ["district.4", "district.29", "district.15"],
};

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: "",
            width: "",
            lphData: "",
            mtshData: "",
            generalData: "",
            chartWidth: "",
            chartHeight: "",
            miniChartWidth: "",
            miniChartHeight: "",
            mapChartHeight: "",
            activeData: "",
            activeKPI: [],
            monthCode: "",
            mapJson: "",
            selectedRegion: "",
            pieKey: Math.random(),
            monthlyBarKey: Math.random(),
            mainBarKey: Math.random(),
            theme: "dark",
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        // const { height, width } = useWindowDimensions();

        const lphData = this.extractDatasets(lphObj);
        const mtshData = this.extractDatasets(mtshObj);
        const generalData = this.extractDatasets(generalObj);

        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        this.setState({
            lphData,
            mtshData,
            generalData,
            mapJson: ugandaJson,
            activeData: generalData,
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        const chartWidth = 0.6 * width;
        const chartHeight = 0.4 * height;

        const miniChartWidth = 0.5 * chartWidth;
        const miniChartHeight = 0.4 * height;
        const mapChartHeight = 0.85 * height;
        this.setState({
            width,
            height,
            chartWidth,
            chartHeight,
            miniChartWidth,
            miniChartHeight,
            mapChartHeight,
        });
    };

    extractDatasets({ metaInput, headers }) {
        // X Values and Key Performance Indicators
        const dimensions = metaInput.metaData.dimensions;
        const months = dimensions.pe;
        const kPIValues = dimensions.dx;
        let finalX = [];
        let finalKPI = [];
        months.forEach((val) => {
            finalX.push(metaInput.metaData.items[val]);
        });

        kPIValues.forEach((val) => {
            finalKPI.push(metaInput.metaData.items[val]);
        });

        // Actual data values
        const dataSets = headers.rows;

        // console.log("Months are ", finalX); // the uid and also the actual name of the month

        // console.log("dataSets are ", dataSets); // The weird id, the month id and the value for the graph

        //console.log("kPIValues are", finalKPI);  // the weird id and the name of the key performance indicator

        // const singleBarChartWidth = this.state.chartWidth / finalX.length; // Subtract padding
        return {
            months: finalX,
            kPIValues: finalKPI,
            dataSets,
            uids: kPIValues,
            colors: Colors,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevState.activeData);
        if (
            !isEqual(
                prevState.activeData?.dataSets?.[0],
                this.state.activeData?.dataSets?.[0]
            )
        ) {
            console.log("Component Updated");
            this.resetKeys();
        }
    }

    changeMonthCode = (code) => {
        //         console.log("Code received is", code);
        this.setState({ monthCode: code });
        //     };
    };

    resetKeys = () => {
        console.log("Resetting keys");
        this.setState({
            pieKey: Math.random(),
            monthlyBarKey: Math.random(),
            mainBarKey: Math.random(),
        });
        // alert("Done");
    };

    handleActiveData = (val) => {
        console.log(
            `Val is ${val} and storedval is ${this.state.selectedRegion}`
        );
        let newDataObj;
        if (activeDataTypes.general.includes(val)) {
            console.log("General");
            newDataObj = this.state.generalData;
        }
        if (activeDataTypes.lph.includes(val)) {
            console.log("lph");
            newDataObj = this.state.lphData;
        }
        if (activeDataTypes.mtsh.includes(val)) {
            console.log("mtsh");
            newDataObj = this.state.mtshData;
        }
        this.setState({ selectedRegion: val, activeData: newDataObj });
        // this.resetKeys();
    };

    handleActiveKPI = (val) => {
        // console.log("Val is", val);
        let newActiveKPI;
        if (this.state.activeKPI.includes(val)) {
            newActiveKPI = this.state.activeKPI.filter((item) => item !== val);
        } else {
            newActiveKPI = [...this.state.activeKPI, val];
        }

        this.setState({
            activeKPI: newActiveKPI,
        });

        this.resetKeys();
    };

    toggleTheme = () => {
        this.setState({
            theme: this.state.theme === "dark" ? "light" : "dark",
        });
    };

    render() {
        return (
            <div style={styles.boardContainer}>
                <div style={{ ...styles.topPartition }}></div>
                <div style={styles.boardWrapper}>
                    {/* LEGEND */}
                    <div style={styles.legend}>
                        {Object.keys(kpiNames).map((key, index) => {
                            // let nameID = getKeyByValue(kpiNames, name);
                            let name = kpiNames[key];
                            let matchingColor = Colors[key];

                            return (
                                <LegendKey
                                    key={Math.random()}
                                    kpiKey={key}
                                    kpiName={name}
                                    radius={10}
                                    color={matchingColor}
                                    click={this.handleActiveKPI}
                                    activeKPI={this.state.activeKPI}
                                    theme={this.state.theme}
                                />
                            );
                        })}

                        {/* {this.state.activeKPI.length && <button>
                          </button>} */}
                    </div>
                    {/* MIDDLE */}
                    <div style={styles.leftBoard}>
                        <div style={styles.middlePartition}>
                            {/* Chart Main */}
                            <div style={styles.chartWrapper}>
                                {/* <h5 style={styles.titles}>Chart</h5> */}
                                {/* active === "bar_graph_pretty"
                          ? */}
                                {this.state.activeData && (
                                    <BarChart
                                        dataset={this.state.activeData}
                                        chartWidth={this.state.chartWidth}
                                        chartHeight={this.state.chartHeight}
                                        monthCode={this.state.monthCode}
                                        setMonthCode={this.changeMonthCode}
                                        activeKPI={this.state.activeKPI}
                                        itemKey={this.state.mainBarKey}
                                        handleActiveKPI={this.handleActiveKPI}
                                        theme={this.state.theme}
                                    />
                                )}
                            </div>
                        </div>
                        <div style={styles.bottomPartition}>
                            <div style={styles.bottomPartLeft}>
                                {this.state.activeData &&
                                    this.state.monthCode && (
                                        <PieChart
                                            dataset={this.state.activeData}
                                            chartWidth={
                                                this.state.miniChartWidth
                                            }
                                            chartHeight={
                                                this.state.miniChartHeight
                                            }
                                            monthCode={this.state.monthCode}
                                            activeKPI={this.state.activeKPI}
                                            itemKey={this.state.pieKey}
                                            handleActiveKPI={
                                                this.handleActiveKPI
                                            }
                                        />
                                    )}
                            </div>
                            <div style={styles.bottomPartRight}>
                                {this.state.activeData &&
                                    this.state.monthCode && (
                                        <BarChartMonthly
                                            dataset={this.state.activeData}
                                            chartWidth={
                                                this.state.miniChartWidth
                                            }
                                            chartHeight={
                                                this.state.miniChartHeight
                                            }
                                            monthCode={this.state.monthCode}
                                            activeKPI={this.state.activeKPI}
                                            itemKey={this.state.monthlyBarKey}
                                            handleActiveKPI={
                                                this.handleActiveKPI
                                            }
                                        />
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={styles.rightBoard}>
                        <div style={styles.mapPartition}>
                            {this.state.mapJson && (
                                <InteractiveMap
                                    chartWidth={this.state.miniChartWidth}
                                    chartHeight={this.state.mapChartHeight}
                                    mapJson={this.state.mapJson}
                                    selectRegion={this.handleActiveData}
                                />
                            )}
                        </div>
                    </div>
                    {/* Chart & KPI */}
                    {/* <div style={styles.chartContainer}>
             

              <div style={styles.kpiWrapper}>
                  <h5 style={styles.titles}>KPI</h5>
              </div>
          </div> */}

                    {/* Icons */}
                    {/* <div style={styles.btnContainer}>
              {usableIcons.map((iconName) => {
                  return (
                      <IconBtn
                          key={Math.random()}
                          size={btnSize}
                          margin={marginSize}
                          icon={iconName}
                          bw={active !== iconName}
                          onClick={() => {
                              // logData();
                              setActive(iconName);
                          }}
                      />
                  );
              })}
          </div> */}
                </div>
            </div>
        );
    }
}

// export default Board;

const dark = false;
const themeColor = dark ? "#fff" : "#1a1b1d";
const borderThickness = "2.5px";
const styles = {
    boardContainer: {
        display: "flex",
        flexDirection: "column",
        width: "98vw",
        height: "98vh",
        margin: "auto auto auto auto",
    },

    boardWrapper: {
        flex: 10,
        display: "flex",
        flexDirection: "row",
    },
    legend: {
        flex: 1,
        borderRight: `${borderThickness} solid ${themeColor}`,
        padding: 5,
    },
    legendKey: {
        display: "flex",
        justifyContent: "flex-start",
        fontSize: 11,
        textAlign: "left",
        marginBottom: 3,
    },

    leftBoard: {
        // border: `${borderThickness} solid ${themeColor}`,
        borderRight: `${borderThickness} solid ${themeColor}`,
        flex: 7,
        display: "flex",
        flexDirection: "column",
    },
    rightBoard: {
        // borderRight: `${borderThickness} solid ${themeColor}`,
        // borderTop: `${borderThickness} solid ${themeColor}`,
        // borderBottom: `${borderThickness} solid ${themeColor}`,
        flex: 5,
        display: "flex",
        flexDirection: "column",
    },
    topPartition: {
        flex: 2,
        borderBottom: `${borderThickness} solid ${themeColor}`,
    },
    middlePartition: {
        flex: 5,
        borderBottom: `${borderThickness} solid ${themeColor}`,
    },
    bottomPartition: {
        flex: 5,
        display: "flex",
    },
    bottomPartLeft: {
        borderRight: `${borderThickness} solid ${themeColor}`,
        flex: 6,
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "flex-end",
    },
    bottomPartRight: {
        flex: 6,
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "flex-end",
    },
    mapPartition: {
        flex: 10,
    },
    chartContainer: {
        flex: 9,
        display: "flex",
        flexDirection: "column",
    },
    chartWrapper: {
        // border: "2px solid #000",
        flex: 9,
        padding: 10,
    },
    kpiWrapper: {
        flex: 3,
    },
    titles: {
        textAlign: "left",
    },
};
export default Board;
