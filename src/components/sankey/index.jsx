import React, { useRef, createRef, useState, useEffect } from 'react'
import SankeyDiagram from './sankey'
import data from '../../data/testData.json'

import './sankey.css'


const Sankey = () => {
    
    

    return (
        <div>

            <SankeyDiagram data={data} width='1900' height='600' />

        </div>
    )
}

export default Sankey