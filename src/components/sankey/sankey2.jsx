import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

const SankeyChart = (props) => {

    const { data } = props


    useEffect(() =>{
        drawsankeygraph()
    })

    const drawsankeygraph = () => {

        let margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 450 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("#sankey-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        const color = d3.scaleOrdinal(d3.schemeCategory20);
    }




    return(
        <div id='sankey-container'></div>
    )
}