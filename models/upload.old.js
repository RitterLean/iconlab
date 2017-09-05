var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
    ImageObjects: String,
    CreatorArtist: String,
    Question1: String,
    Question2: String,
    info: String,
});

var UploadSchema = mongoose.Schema({
    name: String,
    // tags: [TagSchema],
    tags: TagSchema,

    created: Date,
    file: Object
});



module.exports = mongoose.model('Upload', UploadSchema);
