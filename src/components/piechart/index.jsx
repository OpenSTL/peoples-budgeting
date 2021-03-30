import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import PieHooks from "./piechart";

const PieChart = () => {
    const generateData = (value, length = 5) =>
        d3.range(length).map((item, index) => ({
            date: index,
            value: value === null || value === undefined ? Math.random() * 100 : value
    }));

    
    const data1 = {
        "1010": {
            "Carceral State": {
                "total_budget": 322091900,
                "general_fund": 250805811,
                "special_revenues": 59445364,
                "grant": 11840725
            },
            "Operations": {
                "total_budget": 176012352,
                "general_fund": 144621107,
                "special_revenues": 30779403,
                "grant": 611842
            },
            "Gov. Administration": {
                "total_budget": 52939806,
                "general_fund": 37797256,
                "special_revenues": 13301453,
                "grant": 1841097
            },
            "Public Debt": {
                "total_budget": 113910312,
                "general_fund": 28820520,
                "special_revenues": 85089792,
                "grant": 0
            },
            "Social Services": {
                "total_budget": 104376722,
                "general_fund": 16249899,
                "special_revenues": 35012673,
                "grant": 53114150
            },
            "City Enterprises": {
                "total_budget": 245519136,
                "general_fund": 0,
                "special_revenues": 245519136,
                "grant": 0
            },
            "Internal Services": {
                "total_budget": 92351677,
                "general_fund": 3325000,
                "special_revenues": 89026677,
                "grant": 0
            }
        }
    }
    const [data, setData] = useState(generateData());
    const changeData = () => {
        
    setData(generateData());
    
    };
    console.log(data)
    return(
        <div className="pieChart">
            
            <div>
                <PieHooks
                    data={data}
                    width={500}
                    height={500}
                    innerRadius={50}
                    outerRadius={100}
                />
            </div>
        </div>
    )
}

export default PieChart;