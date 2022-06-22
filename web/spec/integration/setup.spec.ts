import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { UserODM } from '@app/models/odms/user';

chai.use(chaiHttp);

let mongo: MongoMemoryServer | null = null;

before(async () => {
    mongoose.Promise = Promise
    const mongooseOpts = {
        autoIndex: true,
        autoCreate: true,
    }

    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, mongooseOpts)

    await UserODM.create({
        email: 'test@test.com',
        username: 'test',
        password: 'test',
    });
})

after(async () => {
    await mongoose.connection.close()
    if (mongo !== null) await mongo.stop()
})
