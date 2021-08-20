import mongoose from 'mongoose';
import {setTimeoutPromise} from './utils/timeout-promise';

export async function connectDB() {
    const dbURI = process.env.MONGO_URI;
    const connection = mongoose.connection;

    connection.on('connecting', function () {
        console.log('[MONGO] connecting to MongoDB...');
    });

    connection.on('error', function (error) {
        console.error('[MONGO] Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });

    connection.on('connected', function () {
        console.log('[MONGO] connected!');
    });

    connection.once('open', function () {
        console.log('[MONGO] connection opened!');
    });

    connection.on('reconnected', function () {
        console.log('[MONGO] reconnected!');
    });

    connection.on('disconnected', function () {
        console.log('[MONGO] disconnected!');
        connect(dbURI);
    });

    await connect(dbURI);
}


async function connect(uri: string) {
    try {
        mongoose.set('useFindAndModify', false);
        mongoose.set('returnOriginal', false);
        await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    } catch (err) {
        console.log('[MONGO] error', err);
        await setTimeoutPromise(() => connect(uri), 1000);
    }
}
