const mongoose = require('mongoose');

const connectionURL = process.env.MONGO_URL || 'mongodb://localhost:27017/mala3eb';

mongoose.connect(connectionURL,
    {
        useCreateIndex: true,
        autoIndex: true,
        useNewUrlParser: true
    },
    (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            console.log(`connected successfully to MONGO`);
        }
    })