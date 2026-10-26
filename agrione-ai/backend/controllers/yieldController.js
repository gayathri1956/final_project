const { predictYield } = require('../ml/yield_prediction/service');
const Prediction = require('../models/Prediction');

exports.predict = async (req, res) => {
  try {
    const result = predictYield(req.body);

    await Prediction.create({
      user: req.user._id,
      farm: req.body.farmId || undefined,
      type: 'yield_prediction',
      inputs: req.body,
      result,
      isBaseline: true,
    });

    res.json({ success: true, prediction: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Yield prediction failed.' });
  }
};
