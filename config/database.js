import { Promise, connect, connection } from 'mongoose';
Promise = global.Promise;

import { seedAdminUser } from '../models/User';
import '../models/Article';
import '../models/Edit';

export default config => {
    connect(config.dbPath, {
        useMongoClient: true
    });       
    const db = connection;
    db.once('open', err => {
        if (err) throw err;
        seedAdminUser().then(() => {
            console.log('Database ready');                
        }).catch((reason) => {
            console.log('Something went wrong');
            console.log(reason);
        });
    });
    db.on('error', reason => {
        console.log(reason);
    });
};