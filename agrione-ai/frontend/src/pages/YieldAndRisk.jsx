import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { advisoryApi } from '../api/advisoryApi';
import {
  TrendingUp,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const YieldAndRisk = () => {
  const { activeFarm } = useFarm();
  const [activeSubTab, setActiveSubTab] = useState('yield'); // 'yield' | 'risk'

  // Yield inputs & output
  const [yieldInputs, setYieldInputs] = useState({
    cropName: activeFarm?.primaryCrop || 'Cotton',
    area: activeFarm?.totalArea || 5.5,
    soilHealthScore: 84,
    nitrogen: activeFarm?.soilData?.nitrogen || 135,
    phosphorus: activeFarm?.soilData?.phosphorus || 42,
    potassium: activeFarm?.soilData?.potassium || 195,
    rainfall: 850,
    irrigationAvailable: true,
  });

  const [yieldResult, setYieldResult] = useState({
    predictedYieldPerAcre: 12.8,
    totalExpectedYield: 70.4,
    unit: 'Quintals',
    confidence: 88,
    factors: {
      positive: [
        'Balanced Potassium (195 kg/ha) supports fiber length and boll retention.',
        'Reliable borewell irrigation eliminates mid-season drought stress.',
        'High organic carbon promotes beneficial microbial root activity.',
      ],
      negative: [
        'Potential vegetative nitrogen lag during early branching stage.',
      ],
    },
    suggestions: [
      'Apply split urea dosage with neem coating at 45 days.',
      'Maintain drip irrigation intervals to prevent flower shedding.',
    ],
  });

  // Risk inputs & output
  const [riskInputs, setRiskInputs] = useState({
    cropName: activeFarm?.primaryCrop || 'Cotton',
    weatherRisk: 35,
    pestRisk: 42,
    marketPriceVolatility: 30,
    soilHealthScore: 84,
    irrigationAdequacy: 80,
  });

  const [riskResult, setRiskResult] = useState({
    overallRiskScore: 38,
    riskCategory: 'Low-to-Moderate Risk',
    breakdown: [
      { factor: 'Weather Risk', score: 35, color: '#38bdf8' },
      { factor: 'Pest Outbreak Risk', score: 42, color: '#f59e0b' },
      { factor: 'Market Volatility', score: 30, color: '#a855f7' },
      { factor: 'Water Stress Risk', score: 25, color: '#10b981' },
      { factor: 'Soil Nutrient Lag', score: 20, color: '#34d399' },
    ],
    mitigationStrategies: [
      'Enroll in Pradhan Mantri Fasal Bima Yojana (PMFBY) to hedge against unseasonal rainfall.',
      'Deploy yellow sticky traps and pheromone traps at 5 traps/acre for early pest surveillance.',
      'Stagger crop harvest marketing across 3 tranches to average out mandi price fluctuations.',
    ],
  });

  const handlePredictYield = async (e) => {
    e.preventDefault();
    try {
      const res = await advisoryApi.predictYield({
        farmId: activeFarm?._id,
        ...yieldInputs,
      });
      if (res?.prediction) {
        setYieldResult(res.prediction);
      }
    } catch (e) {
      console.warn('Yield baseline prediction used');
    }
  };

  const handleAssessRisk = async (e) => {
    e.preventDefault();
    try {
      const res = await advisoryApi.assessRisk(riskInputs);
      if (res?.risk) {
        setRiskResult(res.risk);
      }
    } catch (e) {
      console.warn('Risk baseline assessment used');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Harvest Yield & <span className="gradient-text">Risk Intelligence</span>
          </h1>
          <p className="page-subtitle">
            ML yield forecasting per acre combined with multi-dimensional agro-climatic & market risk scoring.
          </p>
        </div>

        <div className="tab-container">
          <button
            onClick={() => setActiveSubTab('yield')}
            className={`tab-btn ${activeSubTab === 'yield' ? 'active' : ''}`}
          >
            <TrendingUp size={15} />
            Yield Forecast
          </button>
          <button
            onClick={() => setActiveSubTab('risk')}
            className={`tab-btn ${activeSubTab === 'risk' ? 'active' : ''}`}
          >
            <ShieldAlert size={15} />
            Multi-factor Risk Radar
          </button>
        </div>
      </div>

      {activeSubTab === 'yield' ? (
        <div className="grid-split-2-1">
          {/* Yield Input Form */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div className="card-title-bar">
              <div className="card-title">
                <TrendingUp size={20} style={{ color: '#10b981' }} />
                Yield Prediction Parameters
              </div>
              <span className="badge badge-success">{activeFarm?.name}</span>
            </div>

            <form onSubmit={handlePredictYield}>
              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={yieldInputs.cropName}
                    onChange={(e) => setYieldInputs({ ...yieldInputs, cropName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cultivated Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={yieldInputs.area}
                    onChange={(e) => setYieldInputs({ ...yieldInputs, area: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid-3" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nitrogen (kg/ha)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={yieldInputs.nitrogen}
                    onChange={(e) => setYieldInputs({ ...yieldInputs, nitrogen: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phosphorus</label>
                  <input
                    type="number"
                    className="form-input"
                    value={yieldInputs.phosphorus}
                    onChange={(e) => setYieldInputs({ ...yieldInputs, phosphorus: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Potassium</label>
                  <input
                    type="number"
                    className="form-input"
                    value={yieldInputs.potassium}
                    onChange={(e) => setYieldInputs({ ...yieldInputs, potassium: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Seasonal Rainfall (mm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={yieldInputs.rainfall}
                    onChange={(e) => setYieldInputs({ ...yieldInputs, rainfall: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Irrigation Assured?</label>
                  <select
                    className="form-select"
                    value={yieldInputs.irrigationAvailable ? 'yes' : 'no'}
                    onChange={(e) => setYieldInputs({ ...yieldInputs, irrigationAvailable: e.target.value === 'yes' })}
                  >
                    <option value="yes">Yes - Assured Irrigation</option>
                    <option value="no">No - Rainfed Only</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Sparkles size={16} />
                Generate ML Yield Prediction
              </button>
            </form>
          </div>

          {/* Yield Result Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Expected Yield Per Acre
              </div>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>
                {yieldResult.predictedYieldPerAcre}
                <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}> {yieldResult.unit} / acre</span>
              </div>
              <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Total Farm Production:{' '}
                <span style={{ color: '#fbbf24', fontSize: '1.2rem' }}>
                  {yieldResult.totalExpectedYield} {yieldResult.unit}
                </span>{' '}
                ({yieldInputs.area} Acres)
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <span className="badge badge-success">Confidence: {yieldResult.confidence}%</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                DRIVING YIELD FACTORS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {yieldResult.factors?.positive?.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Risk Assessment Tab */
        <div className="grid-split-2-1">
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div className="card-title-bar">
              <div className="card-title">
                <ShieldAlert size={20} style={{ color: '#f59e0b' }} />
                Vulnerability Variables
              </div>
            </div>

            <form onSubmit={handleAssessRisk}>
              <div className="form-group">
                <label className="form-label">Weather Volatility Risk ({riskInputs.weatherRisk}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%', accentColor: '#10b981' }}
                  value={riskInputs.weatherRisk}
                  onChange={(e) => setRiskInputs({ ...riskInputs, weatherRisk: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pest & Disease Pressure ({riskInputs.pestRisk}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%', accentColor: '#f59e0b' }}
                  value={riskInputs.pestRisk}
                  onChange={(e) => setRiskInputs({ ...riskInputs, pestRisk: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Market Price Volatility ({riskInputs.marketPriceVolatility}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%', accentColor: '#a855f7' }}
                  value={riskInputs.marketPriceVolatility}
                  onChange={(e) => setRiskInputs({ ...riskInputs, marketPriceVolatility: Number(e.target.value) })}
                />
              </div>

              <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '1rem' }}>
                <Sparkles size={16} />
                Recalculate Composite Risk
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Composite Farm Risk Score
              </div>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                {riskResult.overallRiskScore}
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
              <span className="badge badge-success">{riskResult.riskCategory}</span>
            </div>

            {/* Breakdown Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                RISK FACTOR BREAKDOWN
              </div>
              <div style={{ height: 180, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskResult.breakdown} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                    <YAxis dataKey="factor" type="category" stroke="#64748b" width={110} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d171b', borderRadius: 8 }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {riskResult.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldAndRisk;
