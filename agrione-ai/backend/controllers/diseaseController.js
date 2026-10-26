const { analyzeImage, calculateDiseaseRisk } = require('../ml/disease_detection/service');
const DiseaseAnalysis = require('../models/DiseaseAnalysis');

// Image-based disease detection
exports.detectDisease = async (req, res) => {
  try {
    const cropName = req.body.cropName || '';
    const imagePath = req.file ? req.file.path : '';

    if (!imagePath) {
      return res.status(400).json({ success: false, message: 'Please upload a crop/leaf image.' });
    }

    const result = analyzeImage(cropName);

    // Save analysis
    await DiseaseAnalysis.create({
      user: req.user._id,
      farm: req.body.farmId || undefined,
      imagePath,
      cropName,
      isHealthy: result.isHealthy,
      diseaseName: result.diseaseName,
      confidence: result.confidence,
      riskLevel: result.riskLevel,
      recommendations: result.recommendations,
      isBaseline: true,
    });

    res.json({ success: true, analysis: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Disease analysis failed.' });
  }
};

// Early warning disease risk
exports.getDiseaseRisk = async (req, res) => {
  try {
    const result = calculateDiseaseRisk(req.body);
    res.json({ success: true, riskAnalysis: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Disease risk calculation failed.' });
  }
};
