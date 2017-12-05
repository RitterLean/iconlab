var mongoose = require('mongoose');
var random = require('mongoose-simple-random');



// var UploadSchema = mongoose.Schema({
//     name: Array,
//     tags: {
//         ImageObjects: Array,
//         CreatorArtist: Array,
//         Question1: Array,
//         Question2: Array,
//         tags: Array
//     },
//     created: Date,
//     file: Object
// });



var ImageInformationSchema = mongoose.Schema({
    artist: Array,
    publishingYear: Array,
    publishingLocation: Array,
    medium: Array,
    form: Array
});

var ImageDescrpSchema = mongoose.Schema({
    motives: Array,
    motivesRevolution: Array,
    revolutionLocation: Array
});

var PersonalRelationSchema = mongoose.Schema({
    source: Array,
    placeFoundFirst: Array,
    dateFoundFirst: Array,
    time: Array
});

var imageAnnotationSchema = mongoose.Schema({
        src: String,
        text: String,
        shapes: Array,
        id: String
    }
    /*, {
        _id: false
    }*/
);

var linksSchema = mongoose.Schema({
    stuff: Array
});



var UploadSchema = mongoose.Schema({
    sessionName: Array,
    sessionIdentifier: Array,
    created: Date,
    file: Object,
    imageInformation: ImageInformationSchema,
    imageDescrp: ImageDescrpSchema,
    personalRelation: PersonalRelationSchema,
    imageAnnotation: [imageAnnotationSchema],
    links: linksSchema,
    sessionRecording: Array
});

UploadSchema.plugin(random);

/*UploadSchema.index({
    sessionName: 'text',
    sessionIdentifier: 'text',
    created: 'text',
    imageInformation: {
        artist: 'text'
    },
    imageInformation: {
        publishingYear: 'text'
    },
    imageInformation: {
        publishingLocation: 'text'
    },
    imageInformation: {
        medium: 'text'
    },
    imageInformation: {
        form: 'text'
    },

    imageDescrp: {motives: 'text'}

});*/
UploadSchema.index({
    // 'sessionName': 'text',
    // sessionIdentifier: 'text',
    // created: 'text',
    '$**': 'text'
});

module.exports = mongoose.model('Upload', UploadSchema);