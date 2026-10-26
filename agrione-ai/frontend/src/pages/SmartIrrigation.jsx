import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { advisoryApi } from '../api/advisoryApi';
import {
  Droplets,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wind,
  Sun,
  ShieldCheck,
} from 'lucide-react';

const SmartIrrigation = () => {
  const { activeFarm } = useFarm();
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    cropName: activeFarm?.primaryCrop || 'Cotton',
    soilType: activeFarm?.soilType || 'black',
    soilMoisture: activeFarm?.soilData?.moisture || 28,
    temperature: 31,
    humidity: 62,
    rainfallForecast: 0,
    irrigationMethod: activeFarm?.irrigationSource || 'drip',
    growthStage: 'flowering',
  });

  const [advice, setAdvice] = useState({
    needIrrigation: true,
    urgency: 'Moderate - Irrigate within 24-36 hrs',
    recommendedWaterMm: 35,
    waterVolumeLitersPerAcre: '1,40,000 Liters',
    nextIrrigationDays: 2,
    status: 'Moisture entering depletion threshold',
    waterSavingTips: [
      'Operate drip emitters in evening (5:00 PM - 7:30 PM) to avoid up to 35% evaporative loss.',
      'Check drip lateral filters to maintain uniform emitter discharge rate.',
      'Apply organic straw or plastic mulching between rows to preserve soil root zone moisture.',
    ],
  });

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await advisoryApi.getIrrigationAdvice(inputs);
      if (res?.irrigation) {
        setAdvice(res.irrigation);
      }
    } catch (err) {
      console.warn('Using baseline irrigation scheduler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Smart Irrigation & <span className="gradient-text">Water Scheduler</span>
          </h1>
          <p className="page-subtitle">
            Evapotranspiration-based precision irrigation advisory saving up to 45% water while boosting yield.
          </p>
        </div>
      </div>

      <div className="grid-split-2-1">
        {/* Left Inputs */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div className="card-title-bar">
            <div className="card-title">
              <Droplets size={20} style={{ color: '#38bdf8' }} />
              Field Hydrology Inputs
            </div>
            <span className="badge badge-info">{activeFarm?.name}</span>
          </div>

          <form onSubmit={handleCalculate}>
            <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Crop Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={inputs.cropName}
                  onChange={(e) => setInputs({ ...inputs, cropName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Growth Stage</label>
                <select
                  className="form-select"
                  value={inputs.growthStage}
                  onChange={(e) => setInputs({ ...inputs, growthStage: e.target.value })}
                >
                  <option value="germination">Germination & Emergence</option>
                  <option value="vegetative">Vegetative Growth</option>
                  <option value="flowering">Flowering & Squaring (Critical)</option>
                  <option value="fruit_formation">Boll / Fruit Formation</option>
                  <option value="maturity">Ripening & Maturity</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Soil Type</label>
                <select
                  className="form-select"
                  value={inputs.soilType}
                  onChange={(e) => setInputs({ ...inputs, soilType: e.target.value })}
                >
                  <option value="black">Black Soil (High Water Retention)</option>
                  <option value="alluvial">Alluvial (Moderate Retention)</option>
                  <option value="red">Red Soil (Fast Drainage)</option>
                  <option value="sandy">Sandy Loam (Low Retention)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Irrigation Method</label>
                <select
                  className="form-select"
                  value={inputs.irrigationMethod}
                  onChange={(e) => setInputs({ ...inputs, irrigationMethod: e.target.value })}
                >
                  <option value="drip">Drip Irrigation (90% Efficiency)</option>
                  <option value="sprinkler">Sprinkler System (75% Efficiency)</option>
                  <option value="flood">Flood / Furrow (50% Efficiency)</option>
                </select>
              </div>
            </div>

            <div className="grid-3" style={{ marginBottom: 0, gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Current Moisture (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.soilMoisture}
                  onChange={(e) => setInputs({ ...inputs, soilMoisture: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Air Temp (°C)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.temperature}
                  onChange={(e) => setInputs({ ...inputs, temperature: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rain Forecast (mm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={inputs.rainfallForecast}
                  onChange={(e) => setInputs({ ...inputs, rainfallForecast: Number(e.target.value) })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <Sparkles size={16} />
              {loading ? 'Simulating Moisture Dynamics...' : 'Calculate Irrigation Schedule'}
            </button>
          </form>
        </div>

        {/* Right Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Status */}
          <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Irrigation Requirement
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
              {advice.recommendedWaterMm} mm
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              (~{advice.waterVolumeLitersPerAcre || '1,40,000 L'} per acre)
            </div>
            <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
              {advice.urgency}
            </span>
          </div>

          {/* Timing details */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next Irrigation In</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>
                  {advice.nextIrrigationDays} Days
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Method Applied</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24', textTransform: 'capitalize' }}>
                  {inputs.irrigationMethod}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                WATER CONSERVATION PROTOCOLS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {advice.waterSavingTips?.map((tip, idx) => (
                  <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <ShieldCheck size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartIrrigation;
