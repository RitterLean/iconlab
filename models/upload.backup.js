var mongoose = require('mongoose');

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
    time: Array,
    Relation: Array
});

var TagSchema = mongoose.Schema({
    imageInformation: ImageInformationSchema,
    imageDescrp: ImageDescrpSchema,
    personalRelation: PersonalRelationSchema
});

var UploadSchema = mongoose.Schema({
    sessionName: Array,
    sessionIdentifier: Array,
    tags: TagSchema,
    created: Date,
    file: Object,
    sessionRecording: Array
});



module.exports = mongoose.model('Upload', UploadSchema);
