import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import {
  Sprout,
  Droplets,
  Activity,
  IndianRupee,
  Sun,
  Wind,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Bug,
  Calculator,
  BotMessageSquare,
  Sparkles,
} from 'lucide-react';
import { marketApi } from '../api/marketApi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const MOCK_MANDI_PRICES = [
  { crop: 'Cotton', price: 6500, minPrice: 6000, maxPrice: 7000, market: 'Adilabad' },
  { crop: 'Chilli', price: 12000, minPrice: 10000, maxPrice: 14000, market: 'Guntur' },
  { crop: 'Rice', price: 2200, minPrice: 2000, maxPrice: 2400, market: 'Guntur' },
  { crop: 'Tomato', price: 2500, minPrice: 1500, maxPrice: 3500, market: 'Madanapalle' },
  { crop: 'Wheat', price: 2300, minPrice: 2100, maxPrice: 2500, market: 'Hapur' },
];

const HISTORICAL_HEALTH = [
  { month: 'Apr', score: 68 },
  { month: 'May', score: 72 },
  { month: 'Jun', score: 76 },
  { month: 'Jul', score: 81 },
  { month: 'Aug', score: 85 },
  { month: 'Sep', score: 88 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { activeFarm, notifications, setShowNotificationDrawer } = useFarm();
  const [mandiRates, setMandiRates] = useState(MOCK_MANDI_PRICES);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await marketApi.getMarketData();
        if (res?.marketData && res.marketData.length > 0) {
          setMandiRates(res.marketData.slice(0, 5));
        }
      } catch (e) {}
    };
    fetchMarket();
  }, []);

  const soil = activeFarm?.soilData || {
    nitrogen: 135,
    phosphorus: 42,
    potassium: 195,
    ph: 6.8,
    moisture: 28,
  };

  const nutrientData = [
    { name: 'Nitrogen (N)', current: soil.nitrogen, optimal: 140, unit: 'kg/ha' },
    { name: 'Phosphorus (P)', current: soil.phosphorus, optimal: 40, unit: 'kg/ha' },
    { name: 'Potassium (K)', current: soil.potassium, optimal: 200, unit: 'kg/ha' },
    { name: 'pH Level', current: soil.ph * 20, optimal: 140, unit: 'score' }, // scaled for bar
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Welcome back, <span className="gradient-text">{user?.name || 'Farmer'}</span>
          </h1>
          <p className="page-subtitle">
            Field operations overview for <strong>{activeFarm?.name}</strong> •{' '}
            {activeFarm?.location?.village || 'Guntur'}, {activeFarm?.location?.state || 'AP'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setShowNotificationDrawer(true)}
            className="btn btn-secondary btn-sm"
          >
            <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
            {notifications.length} Active Warnings
          </button>
          <Link to="/assistant" className="btn btn-primary btn-sm">
            <Sparkles size={15} />
            Ask AI Advisor
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4">
        <MetricCard
          title="Soil Health Index"
          value="88"
          unit="/ 100"
          icon={Activity}
          subtitle="Optimal fertility balance"
          badgeText="GOOD"
          badgeType="success"
          glowColor="emerald"
        />

        <MetricCard
          title="Soil Moisture"
          value={soil.moisture || 28}
          unit="%"
          icon={Droplets}
          subtitle="Irrigation suggested in 2 days"
          badgeText="STABLE"
          badgeType="info"
          glowColor="blue"
        />

        <MetricCard
          title="Active Acreage"
          value={activeFarm?.totalArea || 5.5}
          unit={activeFarm?.areaUnit || 'Acres'}
          icon={Sprout}
          subtitle={`Primary Crop: ${activeFarm?.primaryCrop || 'Cotton'}`}
          badgeText={activeFarm?.soilType ? activeFarm.soilType.toUpperCase() : 'BLACK'}
          badgeType="purple"
          glowColor="purple"
        />

        <MetricCard
          title="Benchmark Mandi Price"
          value="₹6,500"
          unit="/ quintal"
          icon={IndianRupee}
          subtitle="Cotton at Adilabad Mandi"
          badgeText="+4.5% THIS WEEK"
          badgeType="warning"
          glowColor="amber"
        />
      </div>

      {/* Split Grid: 2fr Analytics + 1fr Weather & Warnings */}
      <div className="grid-split-2-1">
        {/* Left Column: Soil Health Chart & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Soil Nutrient Balance */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="card-title-bar">
              <div className="card-title">
                <FlaskConical size={20} style={{ color: '#34d399' }} />
                Soil Nutrient Balance (NPK & pH)
              </div>
              <Link to="/soil" className="btn btn-secondary btn-sm">
                View Full Soil Report <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ height: 200, width: '100%', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutrientData} barGap={8}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d171b',
                      borderColor: '#34d399',
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="current" name="Current Value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="optimal" name="Target Optimal" fill="#38bdf8" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                marginTop: '1.25rem',
                textAlign: 'center',
              }}
            >
              <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nitrogen (N)</span>
                <div style={{ fontWeight: 700, color: '#34d399' }}>{soil.nitrogen} kg/ha</div>
              </div>
              <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phosphorus (P)</span>
                <div style={{ fontWeight: 700, color: '#38bdf8' }}>{soil.phosphorus} kg/ha</div>
              </div>
              <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Potassium (K)</span>
                <div style={{ fontWeight: 700, color: '#f59e0b' }}>{soil.potassium} kg/ha</div>
              </div>
              <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>pH Level</span>
                <div style={{ fontWeight: 700, color: '#a855f7' }}>{soil.ph} (Neutral)</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: '#34d399' }} />
              Precision Farming Modules
            </h3>
            <div className="grid-3" style={{ marginBottom: 0 }}>
              <Link to="/crop-recommendation" className="glass-card-interactive">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    <Sprout size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Crop Advisor</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI climate & soil matching</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Discover highest yielding crops tailored for your acreage.
                </div>
              </Link>

              <Link to="/disease-detection" className="glass-card-interactive">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                    <Bug size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Leaf Diagnosis</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vision disease scanner</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Upload crop leaf photo for instant cure & treatment guide.
                </div>
              </Link>

              <Link to="/profit-calculator" className="glass-card-interactive">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                    <Calculator size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Profit Estimator</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue & ROI analysis</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Calculate input costs, projected yield, and net returns.
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Micro Weather, Health Trend & Mandi Rates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Weather Mini Card */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="card-title-bar">
              <div className="card-title">
                <Sun size={20} style={{ color: '#fbbf24' }} />
                Farm Weather
              </div>
              <Link to="/weather" className="badge badge-info" style={{ textTransform: 'none' }}>
                7-Day Forecast
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.5rem 0' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  31°C
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Clear & Sunny • Guntur, AP
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success">Good Sowing Conditions</span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Droplets size={16} style={{ color: '#38bdf8' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Humidity</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>64%</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wind size={16} style={{ color: '#94a3b8' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wind Speed</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>12 km/h</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mandi Live Rates */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="card-title-bar">
              <div className="card-title">
                <IndianRupee size={20} style={{ color: '#10b981' }} />
                APMC Mandi Rates
              </div>
              <Link to="/market" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>
                View All
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mandiRates.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.crop}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {m.market}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                      ₹{m.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      ₹{m.minPrice} - ₹{m.maxPrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
