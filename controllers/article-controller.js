import { create, all, getById, addEdit, lock as _lock, unlock as _unlock } from '../api/article';
import { create as _create, getByArticleId } from '../api/edit';

export function createGet(req, res) {
    let message = req.session.message;
    req.session.message = '';
    res.render('article/create', { message });
}
export async function createPost(req, res) {
    let body = req.body;
    body.authorId = req.user.id;
    try {
        await create(body);
        req.session.message = 'Successful created!';
        res.redirect('/');
    } catch (err) {
        res.render('article/create', { message: err, article: body });
    }
}
export async function viewAll(req, res) {
    try {
        const articles = await all();
        res.render('article/viewAll', { articles });
    } catch (err) {
        console.log(err);
    }
}
export async function details(req, res) {
    try {
        let idArticle = req.params.id;
        const article = await getById(idArticle);
        let lastEdit = article.edits.sort((a, b) => b['dateCreation'] - a['dateCreation'])[0];
        let paragraphs = lastEdit.content.split('\n');
        let isLock = article.isLock;
        if (req.user && req.user.roles.indexOf('Admin') > -1) {
            isLock = false;
        }

        res.render('article/details', {
            title: article['title'],
            paragraphs,
            isLock: isLock,
            _id: article._id
        });
    } catch (err) {
        console.log(err);
    }
}
export async function editGet(req, res) {
    try {
        let message = req.session.message;
        req.session.message = '';
        let id = req.params.id;
        const article = await getById(id);
        if (article.isLock && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'Article is locked!';
            res.redirect('/');
            return;
        }

        let lastEdit = article.edits.sort((a, b) => b['dateCreation'] - a['dateCreation'])[0];
        res.render('article/edit', {
            '_id': article._id,
            'title': article.title,
            'content': lastEdit.content,
            'isLock': article.isLock,
            message
        });
    } catch (err) {
        req.session.message = err;
        res.redirect('/');
    }
}
export async function editPost(req, res) {
    let idArticle = req.params.id;
    let body = req.body;

    try {
        let article = await getById(idArticle);
        if (article.isLock && req.user.roles.indexOf('Admin') === -1) {
            req.session.message = 'Article is locked!';
            res.redirect('/');
            return;
        }
        let edit = await _create(body.content, idArticle, req.user.id);
        await addEdit(edit._id, article);
        req.session.message = 'Successful edited.';
        res.redirect('/');
    } catch (err) {
        res.render('views/edit', body);
    }
}
export async function history(req, res) {
    let articleId = req.params.id;
    try {
        let edits = await getByArticleId(articleId);
        res.render('article/history', { edits });
    } catch (err) {
        console.log(err);
    }
}
export async function lock(req, res) {
    try {
        let idArticle = req.params.id;
        let article = await getById(idArticle);
        await _lock(article);
        req.session.message = 'Article locked successful.';
        res.redirect(`/article/edit/${idArticle}`);
    } catch (err) {
        console.log(err);
    }
}
export async function unlock(req, res) {
    try {
        let idArticle = req.params.id;
        let article = await getById(idArticle);
        await _unlock(article);
        req.session.message = 'Article unlocked successful.';
        res.redirect(`/article/edit/${idArticle}`);
    } catch (err) {
        console.log(err);
    }
}
export async function getLast(req, res) {
    try {
        let articles = await all();
        articles = articles.sort((a, b) => a['dateCreation'] - b['dateCreation']);
        if (articles.length === 0) {
            req.session.message = 'Articles missing.';
            res.redirect('/');
            return;
        }
        let lastArticle = articles[0];
        res.redirect(`/article/details/${lastArticle._id}`);
    } catch (err) {
        console.log(err);
    }
}
export async function search(req, res) {
    try {
        const input = req.body.title;
        let articles = await all();
        articles = articles.filter(a => a.title.indexOf(input) !== -1);
        res.render('article/search', { articles, input });
    } catch (err) {
        console.log(err);
    }
}