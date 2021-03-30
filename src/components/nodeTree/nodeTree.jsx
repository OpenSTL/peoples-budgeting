import React from 'react';
import Tree from 'react-d3-tree';

const data1 = require('../../data/peoplesbudget_json.json')

const NodeTree = () => {
    let data = {
        name: 'Departments',
        children: [
            {
                name: 'SLMPD',
                attributes: {
                    Budget: 129272700
                },
                children: [
                    {name: 'Hello'}
                ]
            },
            {
                name: 'Police Retirement',
                attributes: {
                    Budget: 29026317
                }
            },
            {
                name: 'CJC',
                attributes: {
                    Budget: 21556569
                }
            },
            {
                name: 'MSI',
                attributes: {
                    Budget: 7841889
                }
            },
            {
                name: 'Judicial Offices',
                attributes: {
                    Budget: 45805316
                }
            },
            {
                name: 'Director of Public Safety',
                attributes: {
                    Budget: 742265
                }
            },
            {
                name: 'Other Police Units',
                attributes: {
                    Budget: 16560755
                }
            },
            
        ]
    }
console.log(data1)
    return(
        <div className='tree wrapper' style={{ height: '500px', width: '1800px', border: '1px solid'}}>
            <Tree 
                data={data1}
                orientation='vertical'
            />
        </div>
    )
}

export default NodeTree