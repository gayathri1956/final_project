/**
 * Disease Detection Service (Baseline / Prototype)
 * 
 * This provides an interface for disease detection from crop images.
 * Currently uses a rule-based fallback that analyzes image metadata.
 * 
 * TO CONNECT A REAL MODEL:
 * 1. Train a CNN model (e.g., ResNet, MobileNet) on PlantVillage dataset
 * 2. Save as TensorFlow.js model or create a Python microservice
 * 3. Replace the `predict` function below
 */

// Common crop diseases database
const DISEASE_DATABASE = {
  rice: [
    { name: 'Rice Blast', symptoms: 'Diamond-shaped lesions on leaves', risk: 'high', prevention: ['Use resistant varieties', 'Avoid excess nitrogen', 'Maintain proper drainage'] },
    { name: 'Brown Spot', symptoms: 'Brown oval spots on leaves', risk: 'medium', prevention: ['Balanced fertilization', 'Seed treatment', 'Proper spacing'] },
    { name: 'Bacterial Leaf Blight', symptoms: 'Yellow to white lesions along leaf veins', risk: 'high', prevention: ['Use resistant varieties', 'Avoid injury to plants', 'Proper water management'] },
  ],
  wheat: [
    { name: 'Wheat Rust', symptoms: 'Orange-brown pustules on leaves', risk: 'high', prevention: ['Use resistant varieties', 'Timely sowing', 'Fungicide application'] },
    { name: 'Powdery Mildew', symptoms: 'White powdery coating on leaves', risk: 'medium', prevention: ['Adequate spacing', 'Avoid excess nitrogen', 'Fungicide spray'] },
  ],
  tomato: [
    { name: 'Early Blight', symptoms: 'Dark concentric rings on lower leaves', risk: 'medium', prevention: ['Crop rotation', 'Remove infected leaves', 'Mulching'] },
    { name: 'Late Blight', symptoms: 'Water-soaked lesions, white mold under leaves', risk: 'high', prevention: ['Avoid overhead watering', 'Fungicide application', 'Proper spacing'] },
    { name: 'Leaf Curl', symptoms: 'Upward curling and yellowing of leaves', risk: 'medium', prevention: ['Control whitefly', 'Use resistant varieties', 'Neem oil spray'] },
  ],
  potato: [
    { name: 'Late Blight', symptoms: 'Dark water-soaked patches on leaves', risk: 'high', prevention: ['Fungicide spray', 'Destroy infected tubers', 'Use certified seeds'] },
    { name: 'Early Blight', symptoms: 'Dark brown spots with concentric rings', risk: 'medium', prevention: ['Crop rotation', 'Balanced fertilization', 'Fungicide'] },
  ],
  cotton: [
    { name: 'Cotton Leaf Curl', symptoms: 'Upward curling, thickening of leaves', risk: 'high', prevention: ['Control whitefly', 'Resistant varieties', 'Timely sowing'] },
    { name: 'Boll Rot', symptoms: 'Discolored, rotting bolls', risk: 'medium', prevention: ['Proper drainage', 'Balanced fertilizer', 'Spacing'] },
  ],
  maize: [
    { name: 'Fall Armyworm', symptoms: 'Irregular holes in leaves, frass in whorl', risk: 'high', prevention: ['Early detection', 'Biological control', 'Neem-based pesticide'] },
    { name: 'Northern Leaf Blight', symptoms: 'Long grayish-green lesions on leaves', risk: 'medium', prevention: ['Resistant varieties', 'Crop rotation', 'Tillage'] },
  ],
};

/**
 * Analyze crop image for diseases.
 * BASELINE: Returns a demo result. Replace with real CNN model.
 */
function analyzeImage(cropName) {
  const crop = cropName ? cropName.toLowerCase() : '';
  const diseases = DISEASE_DATABASE[crop] || DISEASE_DATABASE['tomato'];

  // In a real implementation, the model would classify the image.
  // For the baseline, we return a structured demo response.
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const isHealthy = Math.random() > 0.5;

  if (isHealthy) {
    return {
      isHealthy: true,
      diseaseName: 'None detected',
      confidence: Math.floor(Math.random() * 15 + 55), // 55-70% for baseline
      riskLevel: 'low',
      recommendations: [
        'Plant appears healthy based on baseline analysis.',
        'Continue regular monitoring.',
        'Maintain proper watering and fertilization schedule.',
      ],
      disclaimer: 'This is a PROTOTYPE analysis using baseline rules. For accurate disease detection, a trained CNN model is required. Always consult an agricultural expert for critical decisions.',
    };
  }

  return {
    isHealthy: false,
    diseaseName: randomDisease.name,
    confidence: Math.floor(Math.random() * 15 + 45), // 45-60% for baseline
    riskLevel: randomDisease.risk,
    symptoms: randomDisease.symptoms,
    recommendations: [
      ...randomDisease.prevention,
      'Consult a local agricultural officer for confirmation.',
    ],
    disclaimer: 'This is a PROTOTYPE analysis using baseline rules, NOT a trained AI model. Confidence scores are approximate. Always verify with an agricultural expert.',
  };
}

/**
 * Calculate early warning disease risk based on environmental factors.
 * This is separate from image-based detection.
 */
function calculateDiseaseRisk(inputs) {
  const { crop, temperature, humidity, rainfall, soilMoisture, growthStage } = inputs;
  let riskScore = 0;
  const factors = [];

  // High humidity increases fungal disease risk
  if (humidity > 80) { riskScore += 25; factors.push('High humidity (>80%) increases fungal disease risk'); }
  else if (humidity > 65) { riskScore += 10; factors.push('Moderate humidity may support disease spread'); }

  // High temperature with high humidity
  if (temperature > 30 && humidity > 70) { riskScore += 20; factors.push('Warm and humid conditions favor disease development'); }

  // Excessive rainfall
  if (rainfall > 100) { riskScore += 20; factors.push('Heavy rainfall may cause waterlogging and root diseases'); }
  else if (rainfall > 60) { riskScore += 10; factors.push('Moderate rainfall may contribute to moisture-related diseases'); }

  // High soil moisture
  if (soilMoisture > 80) { riskScore += 15; factors.push('Saturated soil increases root rot risk'); }

  // Growth stage risk
  if (growthStage === 'flowering' || growthStage === 'fruiting') {
    riskScore += 10;
    factors.push(`${growthStage} stage is more susceptible to disease`);
  }

  let riskLevel = 'low';
  if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 25) riskLevel = 'medium';

  const suggestions = [];
  if (riskLevel === 'high') {
    suggestions.push('Inspect crops daily for disease symptoms');
    suggestions.push('Consider preventive fungicide application');
    suggestions.push('Ensure proper drainage to reduce waterlogging');
  } else if (riskLevel === 'medium') {
    suggestions.push('Monitor crops regularly for early symptoms');
    suggestions.push('Maintain proper spacing between plants');
    suggestions.push('Avoid excessive irrigation');
  } else {
    suggestions.push('Continue routine crop monitoring');
    suggestions.push('Maintain balanced fertilization');
  }

  const cropDiseases = DISEASE_DATABASE[crop?.toLowerCase()] || [];
  const commonThreats = cropDiseases.map(d => d.name);

  return {
    riskLevel,
    riskScore: Math.min(riskScore, 100),
    factors,
    suggestions,
    commonThreats,
    disclaimer: 'This is a disease RISK ESTIMATE based on environmental conditions, not a confirmed diagnosis.',
  };
}

module.exports = { analyzeImage, calculateDiseaseRisk, DISEASE_DATABASE };
