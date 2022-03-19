import { static } from 'express';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import { urlencoded } from 'body-parser';
import session from 'express-session';
import { initialize, session as _session } from 'passport';

export default app => {
    app.engine('.hbs', handlebars({
        defaultLayout: 'main',
        extname: '.hbs'
    }));

    app.use(cookieParser());
    app.use(urlencoded({extended: true}));
    app.use(session({
        secret: '123456',
        resave: false,
        saveUninitialized: false
    }));
    app.use(initialize());
    app.use(_session());

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user;

            if (req.user.roles.indexOf('Admin') > -1) {
                res.locals.isAdmin = true;
            }
        }
        
        next();
    });

    app.set('view engine', '.hbs');

    app.use(static('./static'));
};