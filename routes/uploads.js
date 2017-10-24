var express = require('express');
var router = express.Router();
var fs = require('fs');
var Upload = require('../models/upload');
var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});

/**
 * Create's the file in the database
 */
// router.post('/', upload.single('file'), function (req, res, next) {
router.post('/', upload.single('file'), function (req, res, next) {

    console.log(req.body);
    var newUpload = {
        sessionName: req.body.sessionName,
        sessionIdentifier: req.body.sessionIdentifier,
        imageInformation: null,
        imageDescrp: null,
        personalRelation: null,
        imageAnnotation: [],
        links: null,
        sessionRecording: null,
        created: Date.now(),
        file: req.file

    };
    Upload.create(newUpload, function (err, next) {
        if (err) {
            next(err);
        } else {
            res.send(newUpload);
        }
    });

});

router.delete('/delete/:uuid/:filename', function (req, res, next) {
    Upload.findOneAndRemove({
        'file.filename': req.params.uuid,
        'file.originalname': req.params.filename
    }, function (err, upload) {
        if (err) next(err);
        else {
            res.send(upload);
            fs.unlink(upload.file.path, (err) => {
                if (err) throw err;
                // console.log('successfully deleted File');
            });
        }
    });
});







router.put('/updateImage/:uuid/:filename', upload.single(), function (req, res, next) {
    console.log(req.body);
    Upload.findOneAndUpdate({
            'file.filename': req.params.uuid,
            'file.originalname': req.params.filename
        }, {
            $set: {
                sessionName: req.body.sessionName,
                sessionIdentifier: req.body.sessionIdentifier,
                imageInformation: req.body.imageInformation,
                imageDescrp: req.body.imageDescrp,
                personalRelation: req.body.personalRelation,
            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});




router.put('/updateUploadData/:uuid/:filename', upload.single(), function (req, res, next) {
    console.log(req.body);
    Upload.findOneAndUpdate({
            'file.filename': req.params.uuid,
            'file.originalname': req.params.filename
        }, {
            $set: {
                sessionName: req.body.sessionName,
                sessionIdentifier: req.body.sessionIdentifier
            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});






// /**
//  * Gets the list of all files from the database
//  */
router.get('/', function (req, res, next) {
    Upload.find({}, function (err, uploads) {
        if (err) next(err);
        else {
            res.send(uploads);
        }
    });
});


router.get('/sessions', function (req, res, next) {
    console.log("Sesssion string");
    Upload.find().distinct('sessionName', function (err, upload) {
        if (err) {
            next(err);
        } else {
            res.send(upload);
        }
        //}).select('name -_id');


        // Upload.find({}, function (err, uploads) {
        // if (err) next(err);
        // else {
        //     console.log(uploads);
        //     res.send(uploads);
        // }
    });
});

router.get('/topics', function (req, res, next) {
    Upload.find().distinct('name', function (err, upload) {
        if (err) {
            next(err);
        } else {
            res.send(upload);
        }
        //}).select('name -_id');


        // Upload.find({}, function (err, uploads) {
        // if (err) next(err);
        // else {
        //     console.log(uploads);
        //     res.send(uploads);
        // }
    });
});


//routes for random image

router.get('/hit', function (req, res, next) {

    Upload.findOneRandom(function (err, result) {
        if (!err) {
            Upload.find({
                'file.filename': result.file.filename,
                'file.originalname': result.file.originalname
            }, function (err, upload) {
                if (err) next(err);
                else {
                    res.send(upload);
                }
            });
        }
    });



});


/**
 * Gets the list of all files from the database with name
 */
router.get('/:author', function (req, res, next) {
    // console.log(req.params.author);
    // console.log("Macklemore");
    // author = req.params.author;
    Upload.find({
        'sessionName': req.params.author
    }, function (err, upload) {
        //console.log(upload)
        if (err) next(err);
        else {
            res.send(upload);
        }
    });
});


/**
 * Gets a file from the hard drive based on the unique ID and the filename
 */

router.get('/:uuid/:filename', function (req, res, next) {
    Upload.findOne({
        'file.filename': req.params.uuid,
        'file.originalname': req.params.filename
    }, function (err, upload) {
        if (err) next(err);
        else {

            // res.send(upload);
            res.set({
                "Content-Disposition": 'attachment; filename="' + upload.file.originalname + '"',
                "Content-Type": upload.file.mimetype
            });
            fs.createReadStream(upload.file.path).pipe(res);
        }
    });
});







router.get('/image/:uuid/:filename', function (req, res, next) {
    Upload.find({
        'file.filename': req.params.uuid,
        'file.originalname': req.params.filename
    }, function (err, upload) {
        if (err) next(err);
        else {
            res.send(upload);
        }
    });
});


router.get('/imageinfo/:uuid/:filename', function (req, res, next) {
    Upload.find({
        'file.filename': req.params.uuid,
        'file.originalname': req.params.filename
    }, function (err, upload) {
        if (err) next(err);
        else {
            res.send(upload);
        }
    });
});


///FORM Routes
/////


router.put('/formImageInfo/:uuid/:filename', upload.single(), function (req, res, next) {
    // console.log(sessionStorage);
    console.log(req.body)
    Upload.findOneAndUpdate({
            'file.filename': req.params.uuid,
            'file.originalname': req.params.filename
        }, {
            $set: {

                imageInformation: req.body.imageInformation

            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});


router.put('/formImageDes/:uuid/:filename', upload.single(), function (req, res, next) {
    // console.log(sessionStorage);
    Upload.findOneAndUpdate({
            'file.filename': req.params.uuid,
            'file.originalname': req.params.filename
        }, {
            $set: {

                imageDescrp: req.body.imageDescrp

            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});


router.put('/formImageDesLocation/:uuid/:filename', upload.single(), function (req, res, next) {
    // console.log(sessionStorage);
    Upload.findOneAndUpdate({
            'file.filename': req.params.uuid,
            'file.originalname': req.params.filename
        }, {
            $set: {

                imageDescrp: {
                    revolutionLocation: req.body.imageDescrp.revolutionLocation

                }
            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});


router.put('/formPRelation/:uuid/:filename', upload.single(), function (req, res, next) {
    // console.log(sessionStorage);
    Upload.findOneAndUpdate({
            'file.filename': req.params.uuid,
            'file.originalname': req.params.filename
        }, {
            $set: {

                personalRelation: req.body.personalRelation

            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});



//annotation routes

router.post('/annotate/:uuid/:filename', upload.single(), function (req, res, next) {
    // var huso = JSON.parse(req.body);
    console.log(req.body);
    Upload.findOneAndUpdate({
            'file.filename': req.params.uuid,
            'file.originalname': req.params.filename
        }, {
            $push: {

                imageAnnotation: {
                    src: req.body.src,
                    text: req.body.text,
                    shapes: req.body.shapes,
                    context: req.body.context
                }

            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});


router.put('/annotate/:uuid/:filename/:id', upload.single(), function (req, res, next) {
    Upload.findOneAndUpdate({
            // 'file.filename': req.params.uuid,
            // 'file.originalname': req.params.filename,
            'imageAnnotation._id': req.params.id
        }, {
            $set: {
                'imageAnnotation.$': {
                    src: req.body.src,
                    text: req.body.text,
                    shapes: req.body.shapes,
                    context: req.body.context
                }
            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});

router.get('/annotate/:uuid/:filename', function (req, res, next) {
    Upload.find({
        'file.filename': req.params.uuid,
        'file.originalname': req.params.filename
    }, function (err, upload) {
        if (err) next(err);
        else {
            res.send(upload[0].imageAnnotation);
        }
    });
});


router.delete('/annotate/:id', upload.single(), function (req, res, next) {
    // var huso = JSON.parse(req.body);

    Upload.findOneAndUpdate({
            'imageAnnotation._id': req.params.id
        }, {
            $pull: {
                imageAnnotation: {
                    _id: req.params.id
                }
            }
        },
        function (err, upload) {
            if (err) next(err);
            else {
                res.send(upload);
            }
        });
});


module.exports = router;