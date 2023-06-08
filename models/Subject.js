const Mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');

const _SubjectSchema = new Mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
        admin: {
            type: String,
            default: null,
        }
    }, 
    {timestamps: true}
);

_SubjectSchema.method('toClient', function() {
    var obj = this.toObject();

    //Rename fields
    obj.id = obj._id;

    // Delete fields
    delete obj._id;
    delete obj.__v;

    return obj;
});

_SubjectSchema.plugin(AutoIncrement.plugin, {
    model: 'Subject',
    startAt: 1,
});

Mongoose.model('Subject', _SubjectSchema);

module.exports = Mongoose.model('Subject');