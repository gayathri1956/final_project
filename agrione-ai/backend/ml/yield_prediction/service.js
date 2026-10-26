/**
 * Yield Prediction Service (Baseline / Prototype)
 * 
 * Estimates crop yield based on soil, climate, and farming inputs.
 * Uses lookup-based baseline with adjustment factors.
 * 
 * Replace with a trained regression model for production accuracy.
 */

const { CROP_DATABASE } = require('../crop_recommendation/service');

function predictYield(inputs) {
  const { crop, farmArea, nitrogen, phosphorus, potassium, pH, rainfall, temperature, season, irrigationType } = inputs;

  const cropData = CROP_DATABASE[crop?.toLowerCase()] || null;
  const baseYield = cropData ? cropData.yieldPerAcre : 15; // quintals per acre
  const cropName = cropData ? cropData.name : (crop || 'Unknown Crop');
  
  let adjustmentFactor = 1.0;
  const factors = [];

  // Nitrogen effect
  if (nitrogen !== undefined) {
    if (cropData && nitrogen >= cropData.N[0] && nitrogen <= cropData.N[1]) {
      adjustmentFactor *= 1.05;
      factors.push({ factor: 'Nitrogen', impact: 'positive', detail: 'Nitrogen within optimal range' });
    } else if (nitrogen < 30) {
      adjustmentFactor *= 0.8;
      factors.push({ factor: 'Nitrogen', impact: 'negative', detail: 'Low nitrogen may reduce yield' });
    }
  }

  // pH effect
  if (pH !== undefined) {
    if (pH >= 6.0 && pH <= 7.5) {
      adjustmentFactor *= 1.03;
      factors.push({ factor: 'Soil pH', impact: 'positive', detail: 'pH in favorable range' });
    } else if (pH < 5.0 || pH > 8.5) {
      adjustmentFactor *= 0.75;
      factors.push({ factor: 'Soil pH', impact: 'negative', detail: 'Extreme pH may significantly reduce yield' });
    }
  }

  // Rainfall effect
  if (rainfall !== undefined) {
    if (cropData && rainfall >= cropData.rainfall[0] && rainfall <= cropData.rainfall[1]) {
      adjustmentFactor *= 1.05;
      factors.push({ factor: 'Rainfall', impact: 'positive', detail: 'Adequate rainfall for crop' });
    } else if (rainfall < 30) {
      adjustmentFactor *= 0.7;
      factors.push({ factor: 'Rainfall', impact: 'negative', detail: 'Low rainfall may stress crop' });
    } else if (rainfall > 250) {
      adjustmentFactor *= 0.8;
      factors.push({ factor: 'Rainfall', impact: 'negative', detail: 'Excess rainfall may cause waterlogging' });
    }
  }

  // Irrigation boost
  if (irrigationType && irrigationType !== 'rainfed') {
    adjustmentFactor *= 1.1;
    factors.push({ factor: 'Irrigation', impact: 'positive', detail: `${irrigationType} irrigation improves water availability` });
  }

  // Temperature effect
  if (temperature !== undefined && cropData) {
    if (temperature >= cropData.temp[0] && temperature <= cropData.temp[1]) {
      adjustmentFactor *= 1.03;
      factors.push({ factor: 'Temperature', impact: 'positive', detail: 'Temperature in optimal range' });
    } else {
      adjustmentFactor *= 0.85;
      factors.push({ factor: 'Temperature', impact: 'negative', detail: 'Temperature outside optimal range for crop' });
    }
  }

  const area = farmArea || 1;
  const yieldPerAcre = Math.round(baseYield * adjustmentFactor * 10) / 10;
  const totalYield = Math.round(yieldPerAcre * area * 10) / 10;

  return {
    crop: cropName,
    yieldPerAcre,
    totalYield,
    unit: 'quintals',
    farmArea: area,
    factors,
    adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
    disclaimer: 'This is a BASELINE yield estimate using rule-based calculations. Actual yields depend on many factors. Replace with a trained ML model for improved accuracy.',
  };
}

module.exports = { predictYield };
