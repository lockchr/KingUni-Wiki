import { create as _create, find } from '../models/Edit';

async function create(content, articleId, authorId) {
    return await _create({ 
        content, 
        article: articleId,
        author: authorId
    });
}

async function getByArticleId(id) {
    let articles = await find({'article': id})
        .populate('article')
        .populate('author');
    
    for(let article of articles) {
        article.date = article.dateCreation.toLocaleString();
    }

    return articles;
}

export default {
    create,
    getByArticleId
};