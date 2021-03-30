import React, { useRef, createRef, useState, useEffect } from 'react'
import SankeyDiagram from './sankey'
import data from '../../data/testData.json'

import './sankey.css'


const Sankey = () => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const svgRef = useRef(0)

    const measureSVG = () => {
        const { width, height } = svgRef.current.getBoundingClientRect();
    
        setWidth(width);
        setHeight(height);
    };

    useEffect(() => {

        measureSVG();
        window.addEventListener('resize', measureSVG);

        return () => {
            window.removeEventListener('resize', measureSVG);
        }

    })

    

    return (
        <div>
            <svg width="1900" height="2000" ref={svgRef}>
                {data && (
                    <SankeyDiagram data={data} width={width} height={height} />
                )}
            </svg>
        </div>
    )
}

export default Sankey