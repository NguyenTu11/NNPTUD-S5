var express = require('express');
var router = express.Router();

let users = [
  { "id": "1", "name": "John Doe", "email": "john@example.com" },
  { "id": "2", "name": "Jane Smith", "email": "jane@example.com" }
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
    success: true,
    data: users
  });
});

module.exports = router;
