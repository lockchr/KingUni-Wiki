import { Schema, model } from 'mongoose';

const editSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dateCreation: { type: Schema.Types.Date, default: Date.now },
    content: { type: Schema.Types.String },
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true }
});

const Edit = model('Edit', editSchema);

export default Edit;