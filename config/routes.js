import { home, user, article } from '../controllers';
import { isAuthed, hasRole } from './auth';

export default app => {
    app.get('/', home.index);
    app.get('/index.html', home.index);

    app.get('/user/register', user.registerGet);
    app.post('/user/register', user.registerPost);

    app.get('/user/login', user.loginGet);
    app.post('/user/login', user.loginPost);
    
    app.get('/user/logout', user.logout);

    app.get('/article/last', article.getLast);
    app.post('/article/search', article.search);

    app.get('/article/create', isAuthed, article.createGet);
    app.post('/article/create', isAuthed, article.createPost);

    app.get('/article/all', article.viewAll);
    app.get('/article/details/:id', article.details);

    app.get('/article/edit/:id', isAuthed, article.editGet);
    app.post('/article/edit/:id', isAuthed, article.editPost);

    app.get('/article/history/:id', isAuthed, article.history);

    app.get('/article/lock/:id', hasRole('Admin'), article.lock);
    app.get('/article/unlock/:id', hasRole('Admin'), article.unlock);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};