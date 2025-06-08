import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Details.css';

const Details = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  // Sample data
  const [data, setData] = useState([
    { name: 'Your Usage', value: 320 },
    { name: 'Average', value: 450 },
    { name: 'Goal', value: 250 }
  ]);

  const handleSelect = (ranges) => {
    setState([ranges.selection]);
    // Simulate data change
    setData([
      { name: 'Your Usage', value: 300 + Math.floor(Math.random() * 100) },
      { name: 'Average', value: 400 + Math.floor(Math.random() * 100) },
      { name: 'Goal', value: 200 + Math.floor(Math.random() * 50) }
    ]);
  };

  return (
    <div className="details-container">
      <h1>Water Usage Details</h1>
      
      <div className="date-range-container">
        <DateRange
          editableDateInputs={true}
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
      </div>

      <div className="chart-container">
        <h2>Usage Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Details;