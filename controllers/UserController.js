const User = require('../models').User;
const Calibration = require('../models').Calibration;

module.exports = {
  async createUser(req, res) {
    return User
      .create({
        name:req.body.name,
        password: req.body.password,
        high_score:req.body.high_score,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },
  async updateUser(req, res) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: Calibration,
          as: 'calibrations',
        }],
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            name: req.body.name || user.name,
						password: req.body.password || user.password,
            high_score: req.body.high_score || user.high_score,
          })
          .then(() => res.status(200).send(user))  // Send back the updated user.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
  async getUsers(req,res) {
    return User
      .all()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  async getUser(req,res) {
    return User
      .findById(req.params.userId, {
        include: [{
          model: Calibration,
          as: 'calibrations',
        }],
        order: [
          [{model: Calibration, as: 'calibrations'}, "createdAt", "desc"]
        ]
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return res.status(200).send(user);
      })
      .catch(error => res.status(400).send(error));
  },

  async deleteUser(req,res) {
    return User
      .findById(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  }
};
