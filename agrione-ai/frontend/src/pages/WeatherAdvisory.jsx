import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { schemesApi } from '../api/schemesApi';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  CloudSun,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

const MOCK_FORECAST = [
  { day: 'Today', tempMax: 32, tempMin: 23, condition: 'Sunny', rainProb: 10, icon: Sun },
  { day: 'Tomorrow', tempMax: 33, tempMin: 24, condition: 'Partly Cloudy', rainProb: 20, icon: CloudSun },
  { day: 'Thursday', tempMax: 30, tempMin: 22, condition: 'Scattered Showers', rainProb: 65, icon: CloudRain },
  { day: 'Friday', tempMax: 29, tempMin: 22, condition: 'Light Rain', rainProb: 75, icon: CloudRain },
  { day: 'Saturday', tempMax: 31, tempMin: 23, condition: 'Partly Cloudy', rainProb: 30, icon: CloudSun },
  { day: 'Sunday', tempMax: 33, tempMin: 24, condition: 'Sunny & Warm', rainProb: 10, icon: Sun },
  { day: 'Monday', tempMax: 34, tempMin: 25, condition: 'Sunny', rainProb: 5, icon: Sun },
];

const WeatherAdvisory = () => {
  const { activeFarm } = useFarm();
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 31.5,
    feelsLike: 34,
    humidity: 64,
    windSpeed: 14,
    precipitationProb: 15,
    condition: 'Mostly Clear & Warm',
    location: `${activeFarm?.location?.district || 'Guntur'}, ${activeFarm?.location?.state || 'Andhra Pradesh'}`,
  });

  const [forecast, setForecast] = useState(MOCK_FORECAST);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await schemesApi.getWeather({
          location: activeFarm?.location?.district || 'Guntur',
        });
        if (res?.current) {
          setCurrentWeather((prev) => ({ ...prev, ...res.current }));
        }
        if (res?.forecast && res.forecast.length > 0) {
          setForecast(res.forecast);
        }
      } catch (e) {}
    };
    fetchWeather();
  }, [activeFarm]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Agro-Meteorological <span className="gradient-text">Weather Advisory</span>
          </h1>
          <p className="page-subtitle">
            Localized forecasts and agricultural advisories for spray timing, irrigation management, and harvest security.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <MapPin size={15} style={{ color: 'var(--primary-light)' }} />
          {currentWeather.location}
        </div>
      </div>

      {/* Hero Weather Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
            }}
          >
            <Sun size={40} />
          </div>
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {currentWeather.temperature}°C
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {currentWeather.condition} • Feels like {currentWeather.feelsLike}°C
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Relative Humidity</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Droplets size={16} /> {currentWeather.humidity}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wind Speed</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Wind size={16} /> {currentWeather.windSpeed} km/h
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rain Probability</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CloudRain size={16} /> {currentWeather.precipitationProb}%
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Row */}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={18} style={{ color: '#34d399' }} />
        7-Day Farm Outlook
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {forecast.map((item, idx) => {
          const Icon = item.icon || Sun;
          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '1.2rem 0.8rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.day}</div>
              <Icon size={28} style={{ color: item.rainProb > 40 ? '#38bdf8' : '#fbbf24' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {item.tempMax}° / <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.tempMin}°</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: item.rainProb > 40 ? '#38bdf8' : 'var(--text-muted)' }}>
                💧 {item.rainProb}% rain
              </div>
            </div>
          );
        })}
      </div>

      {/* Agricultural Advisory Cards */}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle2 size={18} style={{ color: '#10b981' }} />
        Weather-Triggered Field Advisories
      </h3>

      <div className="grid-3">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-success">Recommended</span>
            <div style={{ fontWeight: 700 }}>Optimal Spraying Window</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Today and tomorrow offer calm wind speeds (&lt;15 km/h) and minimal rain probability. Complete planned foliar nutrition or prophylactic pest sprays before Thursday.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-warning">Caution</span>
            <div style={{ fontWeight: 700 }}>Thursday-Friday Rain Alert</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Scattered thunderstorms expected on Thursday-Friday (65-75% probability). Postpone mechanical fertilizer top-dressing to prevent leaching losses.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-info">Farming Tip</span>
            <div style={{ fontWeight: 700 }}>Drainage Preparation</div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Ensure field boundaries and drainage trenches are clear of weed blockages so excess rainfall runs off smoothly without root waterlogging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherAdvisory;
