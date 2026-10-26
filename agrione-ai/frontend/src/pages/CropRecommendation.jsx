import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { advisoryApi } from '../api/advisoryApi';
import {
  Sprout,
  Sparkles,
  CheckCircle2,
  Calendar,
  Droplets,
  TrendingUp,
  Award,
  Clock,
  Layers,
} from 'lucide-react';

const CropRecommendation = () => {
  const { activeFarm } = useFarm();
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    nitrogen: activeFarm?.soilData?.nitrogen || 135,
    phosphorus: activeFarm?.soilData?.phosphorus || 42,
    potassium: activeFarm?.soilData?.potassium || 195,
    ph: activeFarm?.soilData?.ph || 6.8,
    temperature: 30,
    humidity: 65,
    rainfall: 850,
    season: 'kharif',
    state: activeFarm?.location?.state || 'Andhra Pradesh',
  });

  const [recommendations, setRecommendations] = useState([
    {
      crop: 'Cotton',
      confidence: 94,
      matchScore: 'High Match',
      season: 'Kharif',
      durationDays: '150 - 180 days',
      waterRequirement: '600 - 800 mm',
      expectedYieldPerAcre: '10 - 14 Quintals',
      soilSuitability: 'Deep Black / Clay Loam',
      reasons: [
        'Optimal temperature (30°C) matches cotton vegetative and squaring cycle.',
        'High potassium (195 kg/ha) aids fiber strength and boll development.',
        'Black soil provides superior water retention for dry spells.',
      ],
      advisory: 'Ensure preventive spray of neem oil at 45 days. Avoid waterlogging during flowering.',
    },
    {
      crop: 'Chilli (Red/Green)',
      confidence: 89,
      matchScore: 'Favorable',
      season: 'Kharif / Rabi',
      durationDays: '120 - 150 days',
      waterRequirement: '500 - 650 mm',
      expectedYieldPerAcre: '15 - 20 Quintals (Dry)',
      soilSuitability: 'Well-drained Black & Red Loam',
      reasons: [
        'pH 6.8 is within ideal range (6.0 - 7.0) for capsaicin development.',
        'Moderate rainfall (850 mm) prevents root rot when raised beds are used.',
      ],
      advisory: 'Use drip irrigation with fertigation to maximize fruit firmness.',
    },
    {
      crop: 'Maize (Corn)',
      confidence: 82,
      matchScore: 'Good Alternative',
      season: 'Kharif',
      durationDays: '90 - 110 days',
      waterRequirement: '450 - 600 mm',
      expectedYieldPerAcre: '25 - 32 Quintals',
      soilSuitability: 'Fertile Loamy Soils',
      reasons: [
        'Short maturity period enables double cropping in Rabi.',
        'Strong market demand for poultry feed and starch processing.',
      ],
      advisory: 'Apply top dressing of Urea at knee-high and tasseling stages.',
    },
  ]);

  const handleRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await advisoryApi.getRecommendations({
        farmId: activeFarm?._id,
        ...inputs,
      });
      if (res?.recommendations && res.recommendations.length > 0) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.warn('Using baseline crop advisor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Crop Advisory & <span className="gradient-text">Recommendation Engine</span>
          </h1>
          <p className="page-subtitle">
            AI-powered crop matching analyzing microclimate, NPK nutrient levels, rainfall, and agro-ecological season.
          </p>
        </div>
      </div>

      <div className="grid-split-2-1">
        {/* Left Form */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div className="card-title-bar">
            <div className="card-title">
              <Sprout size={20} style={{ color: '#34d399' }} />
              Field & Climate Parameters
            </div>
            <span className="badge badge-success">
              {activeFarm?.name || 'Active Plot'}
            </span>
          </div>

          <form onSubmit={handleRecommend}>
            <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Cropping Season</label>
                <select
                  className="form-select"
                  value={inputs.season}
                  onChange={(e) => setInputs({ ...inputs, season: e.target.value })}
                >
                  <option value="kharif">Kharif (Monsoon: Jun - Oct)</option>
                  <option value="rabi">Rabi (Winter: Oct - Mar)</option>
                  <option value="zaid">Zaid (Summer: Mar - Jun)</option>
                  <option value="year_round">Year-Round / Perennial</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Region / State</label>
                <input
                  type="text"
                  className="form-input"
                  value={inputs.state}
                  onChange={(e) => setInputs({ ...inputs, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: 0, gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nitrogen (N)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.nitrogen}
                  onChange={(e) => setInputs({ ...inputs, nitrogen: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phosphorus (P)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.phosphorus}
                  onChange={(e) => setInputs({ ...inputs, phosphorus: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Potassium (K)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.potassium}
                  onChange={(e) => setInputs({ ...inputs, potassium: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: 0, gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Avg Temp (°C)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.temperature}
                  onChange={(e) => setInputs({ ...inputs, temperature: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Humidity (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.humidity}
                  onChange={(e) => setInputs({ ...inputs, humidity: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Annual Rain (mm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.rainfall}
                  onChange={(e) => setInputs({ ...inputs, rainfall: Number(e.target.value) })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              <Sparkles size={16} />
              {loading ? 'Evaluating Crop Models...' : 'Calculate Optimal Crops'}
            </button>
          </form>
        </div>

        {/* Right: Recommendation Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: '#fbbf24' }} />
            Ranked Crop Matches ({recommendations.length})
          </div>

          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                borderLeft: idx === 0 ? '4px solid var(--primary)' : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>
                    {rec.crop}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Soil: {rec.soilSuitability}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                    {rec.confidence}%
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                    {rec.matchScore}
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  padding: '0.75rem 0',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '0.75rem',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> Duration
                  </div>
                  <strong style={{ color: 'var(--text-primary)' }}>{rec.durationDays}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Droplets size={12} /> Water
                  </div>
                  <strong style={{ color: 'var(--text-primary)' }}>{rec.waterRequirement}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <TrendingUp size={12} /> Exp. Yield
                  </div>
                  <strong style={{ color: 'var(--text-primary)' }}>{rec.expectedYieldPerAcre}</strong>
                </div>
              </div>

              {/* Match Factors */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  SUITABILITY FACTORS
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {rec.reasons?.map((reason, rIdx) => (
                    <li
                      key={rIdx}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '0.4rem',
                      }}
                    >
                      <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advisory Callout */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                💡 <strong>Agronomist Note:</strong> {rec.advisory}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
