const Calibration = require('../models').Calibration;

// Calibrations just need to be saved, modifying them should not be possible.
// As for they deletion, when a user is deleted they will also automatically be deleted if associated with that particular user thanks to the CASCADE option in the model.

module.exports = {
  async createCalibration(req, res) {
    return Calibration
      .create({
        userId: req.body.userId,
        max_inhale: req.body.max_inhale,
        max_exhale: req.body.max_exhale
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  }
};
