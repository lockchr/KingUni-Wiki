import { generateSalt, generateHashedPassword } from '../util/encryption';
const User = require('mongoose').model('User');

export function registerGet(req, res) {
    res.render('user/register');
}
export async function registerPost(req, res) {
    const reqUser = req.body;
    const salt = generateSalt();
    const hashedPass = generateHashedPassword(salt, reqUser.password);

    if (reqUser.password !== reqUser.repeatedPassword) {
        res.locals.message = 'Passwords should match';
        res.render('user/register', { user: reqUser });
        return;
    }
    try {
        const user = await User.create({
            email: reqUser.email,
            hashedPass,
            salt,
            articles: [],
            roles: []
        });
        req.logIn(user, (err, user) => {
            if (err) {
                res.locals.message = err;
                res.render('user/register', { user: reqUser });
            } else {
                req.session.message = 'Registration successful';
                res.redirect('/');
            }
        });
    } catch (e) {
        console.log(e);
        res.locals.message = e.message;
        res.render('user/register', { user: reqUser });
    }
}
export function logout(req, res) {
    req.logout();
    req.session.message = 'Successful logout, good work!';
    res.redirect('/');
}
export function loginGet(req, res) {
    let message = req.session.message;
    req.session.message = '';
    res.render('user/login', { message });
}
export async function loginPost(req, res) {
    const reqUser = req.body;
    try {
        const user = await User.findOne({ email: reqUser.email });
        if (!user) {
            errorHandler('Invalid user data');
            return;
        }
        if (!user.authenticate(reqUser.password)) {
            errorHandler('Invalid user data');
            return;
        }
        req.logIn(user, (err, user) => {
            if (err) {
                errorHandler(err);
            } else {
                req.session.message = 'Login successful!';
                res.redirect('/');
            }
        });
    } catch (e) {
        errorHandler(e);
    }

    function errorHandler(error) {
        console.log(error);
        res.render('user/login', { user: reqUser, message: error });
    }
}