var express = require('express');
var router = express.Router();

// Welcome Page

router.get('/', (req, res) => {
  res.send('Selamat Datang\n HARI');
});

module.exports = router;
