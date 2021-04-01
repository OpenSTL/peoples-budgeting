import React, { useState, useEffect, useRef } from 'react';
import TreeMap, { ColorModel } from "react-d3-treemap";
// Include its styles in you build process as well
import "react-d3-treemap/dist/react.d3.treemap.css"
import data from '../../data/testTreeMap.json'


const TreeMapGraph = () => (
    <TreeMap
        id="myTreeMap"
        width={1000}
        height={1000}
        data={data}
        valueUnit={"USD"}
        hideNumberOfChildren={true}
        colorModel={ColorModel.Value}
    />
)

export default TreeMapGraph