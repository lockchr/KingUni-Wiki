import { Schema, SchemaTypes, model } from 'mongoose';

const articleSchema = new Schema({
    title: { type: Schema.Types.String, required: [true, 'Title is require.'] },
    isLock: { type: Schema.Types.Boolean, default: false },
    edits: [{ type: Schema.Types.ObjectId, ref: 'Edit', default: [] }],
    dateCreation: { type: SchemaTypes.Date, default: Date.now }
});

const Article = model('Article', articleSchema);

export default Article;