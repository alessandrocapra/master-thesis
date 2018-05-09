const express = require('express');
const router = express.Router();

// Importing the controllers containing the desired functions to communicate with the DB
const userController = require('../controllers/UserController');


/* GET home page. */
router.get('/api', (req, res) => {
  res.render('index', { title: 'Express' });
});


/*

  The project will need several APIs covering different aspects:

  * USER
    - signing up
    - logging in
    - saving game data to the user profile
    - retrieve such data

  * SENSING DATA
    - get the pressure sensor data received by Arduino and send it to PhaserIO to control the game

 */

/*  "/api/users"
 *    GET: get list of all existing users
 *    POST: create a new user
 */

router.get('/api/users', userController.getUsers());
// router.post('/api/users', userController.createUser);

/*  "/api/users/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */

// router.get("/api/users/:id", userController.getUser);
// router.put("/api/users/:id", userController.updateUser);
// router.delete("/api/users/:id", userController.deleteUser);


module.exports = router;
