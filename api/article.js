import { create as _create, find, findById } from '../models/Article';
import { create as __create } from './edit';

async function create(data) {
    let title = data.title;
    let content = data.content;
    let authorId = data.authorId;

    if (title === '' || content === '') {
        throw new Error('Fill all inputs!');
    }

    const newArticle = await _create({ title });
    const newEdit = await __create(content, newArticle._id, authorId);
    await addEdit(newEdit._id, newArticle);
    return newArticle;
}

async function all() {
    return await find({}).sort({'title': 1}).populate('edits');
}

async function getById(id) {
    return await findById(id).populate('edits');
}

async function addEdit(editId, article) {
    article.edits.push(editId);
    return await article.save();
}

async function lock(article) {
    article.isLock = true;
    return await article.save();
}

async function unlock(article) {
    article.isLock = false;
    return await article.save();
}

export default {
    create,
    all,
    getById,
    addEdit,
    lock,
    unlock
};