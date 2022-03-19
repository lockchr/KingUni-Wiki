import { Schema, model } from 'mongoose';
import { generateHashedPassword, generateSalt } from '../util/encryption';

const userSchema = new Schema({
    email: { type: Schema.Types.String, required: true, unique: true },
    hashedPass: { type: Schema.Types.String, required: true },
    salt: { type: Schema.Types.String, required: true },
    roles: [{ type: Schema.Types.String }]
});

userSchema.method({
    authenticate: function (password) {
        return generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = generateSalt();
        const hashedPass = generateHashedPassword(salt, 'Admin');
        return User.create({
            email: 'Admin',
            salt,
            hashedPass,
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};

export default User;
