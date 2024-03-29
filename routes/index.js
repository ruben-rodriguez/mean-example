var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken'); 

router.get('/', function(req, res) {
	
	console.log("/ GOT HIT");
	res.json({ success: true });
	
})


router.use('/', require('./auth'));

router.use(function(req, res) {
	
    res.status(404).end('error: nothing to do here!');
	
});

router.use(function(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, req.app.get('secretToken'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

router.use('/', require('./stations'));
router.use('/', require('./measurements'));
router.use('/', require('./users'));


module.exports = router;