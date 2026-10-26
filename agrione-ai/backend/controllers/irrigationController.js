const { getIrrigationAdvice } = require('../ml/irrigation/service');

exports.getAdvice = async (req, res) => {
  try {
    const result = getIrrigationAdvice(req.body);
    res.json({ success: true, irrigation: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Irrigation analysis failed.' });
  }
};
