export function isAuthed(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.session.message = 'First you must login!';
        res.redirect('/user/login');
    }
}
export function hasRole(role) {
    return (req, res, next) => {
        if (req.isAuthenticated() &&
            req.user.roles.indexOf(role) > -1) {
            next();
        } else {
            req.session.message = 'You are not admin!';
            res.redirect('/user/login');
        }
    };
}