import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

const SankeyNode = ({ name, x0, x1, y0, y1, colors, index, length, width, height}) => (

    <>
        <rect 
        x={x0} 
        y={y0} 
        width={x1 - x0} 
        height={y1 - y0} 
        fill={colors(index / length)}
        data-index={index}
        />
        <text
        id="node-label"
        x={x0 < width / 2 ? x1 + 6 : x0 - 6}
        y={(y1 + y0) / 2}
        style={{
          fill: d3.rgb(colors(index / length)).darker(),
          alignmentBaseline: "middle",
          fontSize: 18,
          textAnchor: x0 < width / 2 ? "start" : "end",
          pointerEvents: "none",
          userSelect: "none",
          zindex: '-1',
          position: 'relative'
        }}
        >
        {name}
        </text>
    </>   
);
  
const SankeyLink = ({ colors, data, width, length }) => (

    <>
        <defs>
            <linearGradient
                id={`gradient-${data.index}`}
                gradientUnits='userSpaceOnUse'
                x1={data.source.x1}
                x2={data.target.x0}
            >
                <stop offset="0" stopColor={colors(data.source.index / length)} />
                <stop offset="100%" stopColor={colors(data.target.index / length)} />
            </linearGradient>
        </defs>
        <path
            d={sankeyLinkHorizontal()(data)}
            style={{
                fill: "none",
                strokeOpacity: '0.5',
                stroke: `url(#gradient-${data.index})`,
                strokeWidth: width
              }}
        />
    </>
);

const SankeyDiagram = (props) => {
    const { data, width, height } = props
    const graph = useRef(null);
    

    const layout = sankey()
    .nodeWidth(15)
    .nodePadding(20)
    .extent([[1, 1], [width - 1, height - 5]])

    const colors = d3.interpolateCool

    
    if (data) {
        graph.current = layout(data)
        const { nodes, links } = graph.current
        console.log(links)
        return (
            <svg width={width} height={height}>
                <g>
                    {nodes.map((node, i) => (
                        <SankeyNode
                        {...node}
                        colors={colors}
                        width={width}
                        height={height}
                        
                        />
                    ))}
                </g>
                <g>
                    {links.map((link, i) => (
                        <SankeyLink
                        data={link}
                        colors={colors}
                        width={link.width}
                        length={nodes.length}
                        />
                    ))}
                </g>
            </svg>
        )
    }
    

    return (
        <div>Loading...</div>
    )
}

export default SankeyDiagram;