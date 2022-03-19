import { use, serializeUser, deserializeUser } from 'passport';
import LocalPassport from 'passport-local';
const User = require('mongoose').model('User');

export default () => {
    use(new LocalPassport((email, password, done) => {
        User.findOne({ email: email }).then(user => {
            if (!user) return done(null, false);
            if (!user.authenticate(password)) return done(null, false);
            return done(null, user);
        });
    }));

    serializeUser((user, done) => {
        if (user) return done(null, user._id);
    });

    deserializeUser((id, done) => {
        User.findById(id).then(user => {
            if (!user) return done(null, false);
            return done(null, user);        
        });
    });
};