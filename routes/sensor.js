const express = require('express');
const router = express.Router();

/* POST sensor */
router.post('/', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
