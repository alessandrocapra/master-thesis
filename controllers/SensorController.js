module.exports = {
  receiveSensorData(req, res) {
    res.render('index', { title: 'Express', value: req.body.title });
    /*try {
      const player = await Player.create(req.body)
      res.send(player.toJSON())
    } catch(err) {
      res.status(400).send({
        error: 'Name already in use!'
      })
      // user already existing?
    }*/
  }
};
