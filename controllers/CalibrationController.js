const Calibration = require('../models').Calibration;

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
    /*try {
      const player = await Player.create(req.body)
      res.send(player.toJSON())
    } catch(err) {
      res.status(400).send({
        error: 'Name already in use!'
      })
      // user already existing?
    }*/
  },
  async updateUser(req, res) {
    /*try {
      await Player.update({
        skipTopics: req.body.skipTopics,
        skipQuestions: req.body.skipQuestions
      }, {
        where: {id: req.body.id}
      }).then(result => res.send(result))
    } catch(err) {
      res.status(400).send({
        error: err.message
      })
      // user already existing?
    }*/
  },
  async getUsers(req,res) {
    /*try {
      const players = await Player.findAll({
        order: [
          ['name', 'ASC'],
          ['lastname', 'ASC'],
        ],})
      res.send(players)
    } catch(err) {
      res.status(400).send({
        error: 'Couldn\'t get the players!'
      })
    }*/

    return User
      .all()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },
  async getUser(req,res) {

    /*try {
      const player = await Player.findOne({ where: {id: req.params.id} })
      res.send(player)
    } catch(err) {
      res.status(400).send({
        error: 'Couldn\'t get the player details!'
      })
    }*/
  },
  async deleteUser(req,res) {

  }
};
