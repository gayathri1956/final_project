import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import {
  MapPin,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Droplets,
  Sprout,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

const FarmManagement = () => {
  const { farms, activeFarm, setActiveFarm, addFarm, updateSoil } = useFarm();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [selectedFarmForSoil, setSelectedFarmForSoil] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    village: '',
    totalArea: 4,
    areaUnit: 'acres',
    soilType: 'black',
    irrigationSource: 'borewell',
    primaryCrop: 'Cotton',
    currentCrops: 'Cotton, Chilli',
  });

  const [soilFormData, setSoilFormData] = useState({
    nitrogen: 140,
    phosphorus: 40,
    potassium: 200,
    ph: 6.8,
    organicCarbon: 0.6,
    moisture: 30,
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    await addFarm({
      name: formData.name,
      location: {
        state: formData.state,
        district: formData.district,
        village: formData.village,
      },
      totalArea: parseFloat(formData.totalArea),
      areaUnit: formData.areaUnit,
      soilType: formData.soilType,
      irrigationSource: formData.irrigationSource,
      primaryCrop: formData.primaryCrop,
      currentCrops: formData.currentCrops.split(',').map((c) => c.trim()),
    });
    setShowAddModal(false);
    setFormData({
      name: '',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: '',
      totalArea: 4,
      areaUnit: 'acres',
      soilType: 'black',
      irrigationSource: 'borewell',
      primaryCrop: 'Cotton',
      currentCrops: 'Cotton, Chilli',
    });
  };

  const handleOpenSoil = (farm) => {
    setSelectedFarmForSoil(farm);
    if (farm.soilData) {
      setSoilFormData({
        nitrogen: farm.soilData.nitrogen || 140,
        phosphorus: farm.soilData.phosphorus || 40,
        potassium: farm.soilData.potassium || 200,
        ph: farm.soilData.ph || 6.8,
        organicCarbon: farm.soilData.organicCarbon || 0.6,
        moisture: farm.soilData.moisture || 30,
      });
    }
    setShowSoilModal(true);
  };

  const handleSaveSoil = async (e) => {
    e.preventDefault();
    if (selectedFarmForSoil) {
      await updateSoil(selectedFarmForSoil._id, {
        nitrogen: Number(soilFormData.nitrogen),
        phosphorus: Number(soilFormData.phosphorus),
        potassium: Number(soilFormData.potassium),
        ph: Number(soilFormData.ph),
        organicCarbon: Number(soilFormData.organicCarbon),
        moisture: Number(soilFormData.moisture),
      });
    }
    setShowSoilModal(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            My Registered <span className="gradient-text">Farm Plots</span>
          </h1>
          <p className="page-subtitle">
            Manage your land parcels, GPS locations, irrigation facilities, and soil test parameters.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Register New Farm
        </button>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid-2">
        {farms.map((farm) => {
          const isActive = activeFarm?._id === farm._id;
          return (
            <div
              key={farm._id}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                border: isActive
                  ? '2px solid var(--primary)'
                  : '1px solid var(--border-subtle)',
                boxShadow: isActive ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'none',
                position: 'relative',
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#34d399',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={16} />
                  ACTIVE PLOT
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>
                  {farm.name}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  <MapPin size={14} />
                  {farm.location?.village ? `${farm.location.village}, ` : ''}
                  {farm.location?.district || 'Guntur'}, {farm.location?.state || 'AP'}
                </div>
              </div>

              {/* Attributes Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  padding: '1rem 0',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  margin: '1rem 0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Area</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {farm.totalArea} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{farm.areaUnit || 'Acres'}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Soil Type</div>
                  <div style={{ fontWeight: 700, textTransform: 'capitalize', color: '#fbbf24' }}>
                    {farm.soilType || 'Black'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Irrigation</div>
                  <div style={{ fontWeight: 700, textTransform: 'capitalize', color: '#38bdf8' }}>
                    {farm.irrigationSource || 'Borewell'}
                  </div>
                </div>
              </div>

              {/* Soil Data Summary Pill */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.4rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span>Soil Parameters</span>
                  <button
                    onClick={() => handleOpenSoil(farm)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary-light)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Edit size={12} /> Edit Test Values
                  </button>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    textAlign: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>N:</span>{' '}
                    <strong>{farm.soilData?.nitrogen || 140}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>P:</span>{' '}
                    <strong>{farm.soilData?.phosphorus || 40}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>K:</span>{' '}
                    <strong>{farm.soilData?.potassium || 200}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>pH:</span>{' '}
                    <strong>{farm.soilData?.ph || 6.8}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Moist:</span>{' '}
                    <strong>{farm.soilData?.moisture || 30}%</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {!isActive && (
                  <button
                    onClick={() => setActiveFarm(farm)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    Set as Active Plot
                  </button>
                )}
                <button
                  onClick={() => handleOpenSoil(farm)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Sparkles size={14} />
                  Update Soil Metrics
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Farm Parcel</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="modal-body">
              <div className="form-group">
                <label className="form-label">Farm / Plot Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. North Canal Plot B"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Total Acreage</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-input"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Area Unit</label>
                  <select
                    className="form-select"
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="bigha">Bigha</option>
                    <option value="guntha">Guntha</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Soil Type</label>
                  <select
                    className="form-select"
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  >
                    <option value="black">Black Soil (Regur)</option>
                    <option value="alluvial">Alluvial Soil</option>
                    <option value="red">Red Soil</option>
                    <option value="laterite">Laterite Soil</option>
                    <option value="sandy">Sandy Loam</option>
                    <option value="clayey">Clayey Soil</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Irrigation Source</label>
                  <select
                    className="form-select"
                    value={formData.irrigationSource}
                    onChange={(e) => setFormData({ ...formData, irrigationSource: e.target.value })}
                  >
                    <option value="borewell">Borewell</option>
                    <option value="canal">Canal Irrigation</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler System</option>
                    <option value="river">River Lift</option>
                    <option value="rainfed">Rainfed (No artificial)</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Primary Crop</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.primaryCrop}
                    onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                    placeholder="e.g. Cotton, Rice, Maize"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Village / Taluk</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="e.g. Pedavadlapudi"
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Soil Parameters Modal */}
      {showSoilModal && (
        <div className="modal-overlay" onClick={() => setShowSoilModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Update Soil Test Values</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Farm: {selectedFarmForSoil?.name}
                </p>
              </div>
              <button
                onClick={() => setShowSoilModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSoil} className="modal-body">
              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nitrogen (N) - kg/ha</label>
                  <input
                    type="number"
                    className="form-input"
                    value={soilFormData.nitrogen}
                    onChange={(e) => setSoilFormData({ ...soilFormData, nitrogen: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phosphorus (P) - kg/ha</label>
                  <input
                    type="number"
                    className="form-input"
                    value={soilFormData.phosphorus}
                    onChange={(e) => setSoilFormData({ ...soilFormData, phosphorus: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Potassium (K) - kg/ha</label>
                  <input
                    type="number"
                    className="form-input"
                    value={soilFormData.potassium}
                    onChange={(e) => setSoilFormData({ ...soilFormData, potassium: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Soil pH (0 - 14)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={soilFormData.ph}
                    onChange={(e) => setSoilFormData({ ...soilFormData, ph: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: 0, gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={soilFormData.organicCarbon}
                    onChange={(e) => setSoilFormData({ ...soilFormData, organicCarbon: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Soil Moisture (%)</label>
                  <input
                    type="number"
                    step="1"
                    className="form-input"
                    value={soilFormData.moisture}
                    onChange={(e) => setSoilFormData({ ...soilFormData, moisture: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '1rem 0 0', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setShowSoilModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Soil Values
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmManagement;
