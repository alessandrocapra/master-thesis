var Server = require('../server');

module.exports = {
  receiveSensorData(req, res) {
    // res.render('index', { title: 'Express', value: req.body.title });

    // send data to client through socketIO
    let data = req.body.value;

    console.log("req'body is " + data);

    // send data with socketIO
    Server.io.emit('value', data);
    res.send(data);

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
