const Mongoose = require("mongoose")
const AutoIncrement = require("mongoose-auto-increment")

const _textSchema = new Mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            index: {
                unique: true,
            }
        },
        subject: {type: Mongoose.Schema.Types.Number, ref: "Subject", required: true}
        
    },
    {
        timestamps: true
    },
);

_textSchema.method('toClient', function() {
    var obj = this.toObject();

    //Rename fields
    obj.id = obj._id;
    obj.subject = {
        id: obj.subject._id,
        title: obj.subject.title,

    }
    // Delete fields
    delete obj._id;
    delete obj.__v;

    return obj;
});


_textSchema.plugin(AutoIncrement.plugin, {
    model: 'Text',
    startAt: 1,
});

Mongoose.model('Text', _textSchema);

module.exports = Mongoose.model('Text');