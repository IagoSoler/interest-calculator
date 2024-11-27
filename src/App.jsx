import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './App.css'; // Importa la hoja de estilos

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Year: ${label}`}</p>
        <p className="intro">{`Lower Rate: ${payload[0].value.toFixed(2)}`} €</p>
        <p className="intro">{`Average Rate: ${payload[1].value.toFixed(2)}`} €</p>
        <p className="intro">{`Upper Rate: ${payload[2].value.toFixed(2)}`} €</p>
      </div>
    );
  }

  return null;
};

const App = () => {
  const [formData, setFormData] = useState({
    startingAmount: 0,
    periodicContribution: 0,
    contributionPeriodicity: 'monthly',
    capitalizationFrequency: 'monthly',
    lowerInterestRate: 0,
    upperInterestRate: 0,
    durationYears: 0,
  });

  const [chartData, setChartData] = useState([]);

  const contributionFrequencies = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    semianually: 2,
    annually: 1,
  };

  const capitalizationFrequencies = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    quarterly: 4,
    semianually: 2,
    annually: 1,
  };

  const calculateFutureValue = (P, C, r, n, t, contributionFreq) => {
    const contributionsPerYear = contributionFrequencies[contributionFreq];

    const annualRate = r / 100;
    const i = (1 + annualRate / n) ** (n / contributionsPerYear) - 1;

    const fvP = P * (1 + annualRate / n) ** (n * t);

    const fvC = C * ((1 + i) ** (contributionsPerYear * t) - 1) / i;
    const fv = fvP + fvC;
    return fv;
  };

  useEffect(() => {
    const {
      startingAmount,
      periodicContribution,
      contributionPeriodicity,
      capitalizationFrequency,
      lowerInterestRate,
      upperInterestRate,
      durationYears,
    } = formData;

    if (
      startingAmount === 0 &&
      periodicContribution === 0 &&
      lowerInterestRate === 0 &&
      upperInterestRate === 0 &&
      durationYears === 0
    ) {
      setChartData([]);
      return;
    }

    const n = capitalizationFrequencies[capitalizationFrequency];
    const t = durationYears;

    const lowerRate = lowerInterestRate / 100;
    const upperRate = upperInterestRate / 100;
    const averageRate = (lowerRate + upperRate) / 2;

    const dataPoints = [];
    for (let year = 1; year <= t; year++) {
      const lowerFV = calculateFutureValue(
        startingAmount,
        periodicContribution,
        lowerInterestRate,
        n,
        year,
        contributionPeriodicity
      );

      const upperFV = calculateFutureValue(
        startingAmount,
        periodicContribution,
        upperInterestRate,
        n,
        year,
        contributionPeriodicity
      );

      const averageFV = calculateFutureValue(
        startingAmount,
        periodicContribution,
        averageRate * 100,
        n,
        year,
        contributionPeriodicity
      );

      dataPoints.push({ year, lower: lowerFV, upper: upperFV, average: averageFV });
    }

    setChartData(dataPoints);
  }, [
    formData.startingAmount,
    formData.periodicContribution,
    formData.contributionPeriodicity,
    formData.capitalizationFrequency,
    formData.lowerInterestRate,
    formData.upperInterestRate,
    formData.durationYears,
  ]);

  return (
    <div className="app-container">
      <h1 className="title"> Interest Calculator</h1>

      <div className='input__output'>
        <form className="form">
          <label className="form-label">
            Starting Amount:
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.startingAmount || ''}
              onChange={(e) =>
                setFormData({ ...formData, startingAmount: parseFloat(e.target.value) || 0 })
              }
            />
          </label>
          <label className="form-label">
            Periodic Contribution:
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.periodicContribution || ''}
              onChange={(e) =>
                setFormData({ ...formData, periodicContribution: parseFloat(e.target.value) || 0 })
              }
            />
          </label>
          <label className="form-label">
            Contribution Periodicity:
            <select
              className="form-select"
              value={formData.contributionPeriodicity}
              onChange={(e) => setFormData({ ...formData, contributionPeriodicity: e.target.value })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semiannually">Semiannually</option>
              <option value="annually">Annually</option>
            </select>
          </label>
          <label className="form-label">
            Capitalization Frequency:
            <select
              className="form-select"
              value={formData.capitalizationFrequency}
              onChange={(e) => setFormData({ ...formData, capitalizationFrequency: e.target.value })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semiannually">Semiannually</option>
              <option value="annually">Annually</option>
            </select>
          </label>
          <div className='form-rate__inputs'>
            <label className="form-label">
              Lower Interest Rate (%):
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.lowerInterestRate || ''}
                onChange={(e) =>
                  setFormData({ ...formData, lowerInterestRate: parseFloat(e.target.value) || 0 })
                }
              />
            </label>
            <label className="form-label">
              Upper Interest Rate (%):
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={formData.upperInterestRate || ''}
                onChange={(e) =>
                  setFormData({ ...formData, upperInterestRate: parseFloat(e.target.value) || 0 })
                }
              />
            </label>
          </div>
          <label className="form-label">
            Duration (Years):
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.durationYears || ''}
              onChange={(e) =>
                setFormData({ ...formData, durationYears: parseFloat(e.target.value) || 0 })
              }
            />
          </label>
        </form>
        <div className="output-section">
          {chartData.length > 0 ? (
            <div className="results-container">
              <div className="result-item">
                <p>Average result:</p>
                <p>{chartData[chartData.length - 1].average.toFixed(2)} €</p>
              </div>
              <div className="result-item">
                <p>Upper result:</p>
                <p>{chartData[chartData.length - 1].upper.toFixed(2)} €</p>
              </div>
              <div className="result-item">
                <p>Lower result:</p>
                <p>{chartData[chartData.length - 1].lower.toFixed(2)} €</p>
              </div>
            </div>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="chart-container">
          <h2>Investment Growth Over Time</h2>
          <LineChart width={800} height={400} data={chartData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="lower" name="Lower Rate" stroke="#8884d8" />
            <Line type="monotone" dataKey="average" name="Average Rate" stroke="#82ca9d" />
            <Line type="monotone" dataKey="upper" name="Upper Rate" stroke="#ff7300" />
          </LineChart>
        </div>
      )}
    </div>
  );
}

export default App;