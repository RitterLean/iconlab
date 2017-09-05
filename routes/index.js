var express = require('express');
var router = express.Router();
var path = require('path');

// middleware that is specific to this router
router.get('/', function (req, res, next) {
  var index = path.join(__dirname, '../public/views/index.html');
  res.sendFile(index);
});

// router.get('/viewAll', function(req, res, next) {
//   var index = path.join(__dirname, '../public/views/viewAll.html');
//   res.sendFile(index);
// });

// router.get('/viewSessions', function(req, res, next) {
//   var index = path.join(__dirname, '../public/views/viewAllPartner.html');
//   res.sendFile(index);
// });

// router.get('/viewAuthor', function(req, res, next) {
//   var index = path.join(__dirname, '../public/views/viewAuthor.html');
//   res.sendFile(index);
// });




// router.get('/indexNew', function(req, res, next) {
//   var index = path.join(__dirname, '../public/views/indexNew.html');
//   res.sendFile(index);
// });

// router.get('/viewSingleUploaded', function(req, res, next) {
//   var index = path.join(__dirname, '../public/views/viewUploadedImage.html');
//   res.sendFile(index);
// });

// router.get('/form', function(req, res, next) {
//   var index = path.join(__dirname, '../public/views/form.html');
//   res.sendFile(index);
// });

module.exports = router;