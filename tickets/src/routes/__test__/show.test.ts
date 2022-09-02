import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
})


it('returns the ticket if the its found', async () => {
    const response = await request(app)
        .post('/api/tickets/')
        .set('Cookie', global.signin())
        .send({
            title: 'test',
            price: 10
        })
        .expect(201)

    const ticket = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)

    expect(ticket.body.title).toEqual('test')

    

})