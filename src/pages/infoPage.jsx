import React from 'react';
import PieChart from '../components/piechart/index'
import Sankey from '../components/sankey/index'
import TreeMap from '../components/treemap/treemap'
import Sunburst from '../components/sunburst/index'
import '../css/infoPage.css';

let pieData = [{label: 'Carceral State', value: '$322091900'}, {label: 'Operations', value: '$176012352'}, {label: 'Gov. Administration', value: '$52939806'}, {label: 'Public Debt', value: '$113910312'}, {label: 'Social Services', value: '$104376722'}, {label: 'City Enterprises', value: '$245519136'}, {label: 'Internal Services', value: '$92351677'}, ]

const mainPage = () => {
    

    return (
        <div className='main'>
            <section className="title" >
                
                <div className="framing-text">
                    <h1></h1>
                    <p> Budgets are moral documents which reflect our values and priorities. Unfortunately, the city budgeting process is notoriously opaque, and is designed to meet the needs of political and economic elites, not the people. This interactive budget visualization is intended to empower St. Louisans to both understand the city budget, and to communicate their fiscal priorities. </p>
                </div>
                
            </section>
            <section className="data">
                <h1>FY 2020-2021 General Fund</h1>
                <p>Please hover over each color to see more information</p>
                <div className="piechart">
                    <Sunburst/>
                    <br/>
                    <br/>
                    <div className="pie-description">
                        <p>The city's General Fund represents the city's largest and most flexible pool of resources. While the  city's entire FY21 budget was over one billion ($1,110.4M), most of these revenues are restricted for legally specified uses. For example, $245.5M are revenues generated by the airport and water department, and may only be used for purposes related to these city "enterprises." Similarly, another $383.3M in funds are derived from taxes whose ballot language committed revenues to specific uses, from grants for specific programs, or from other restricted revenue streams. The General Fund, on the other hand, is funded by the city's earnings, sales, property, payroll, and utility taxes, as well as certain other unrestricted revenue sources, and may be used for any public purpose. As our visualization details, these general revenues fund the city's core functions.</p>
                    </div>
                </div>
            
                
            </section>
        
        </div>
    )
}

export default mainPage;