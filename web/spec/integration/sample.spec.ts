import { notEqual } from 'assert'
import { expressApp } from './util.spec'

import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

describe('Sample integration tests', () => {
    it('should login', async () => {
        const resp = await chai.request(expressApp).post('/auth/login').send({
            username: 'test',
            password: 'test',
        })
        notEqual(resp.body.token, undefined)
    })
})
