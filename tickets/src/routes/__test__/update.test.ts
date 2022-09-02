import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns a 404 if the provided id does not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Test Ticket',
            price: 20
        })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Test Ticket',
            price: 20
        })
        .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Test Ticket',
            price: 1
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Test Ticket',
            price: 25
        })
        .expect(401)

})

it('returns a 400 if the user provided an invalid title or price', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Test Ticket',
            price: 1
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 25
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Test Ticket',
            price: -25
        })
        .expect(400)

})

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Test Ticket',
            price: 1
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'New Title Test Ticket',
            price: 200
        })
        .expect(200)

    const ticket = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticket.body.title).toEqual('New Title Test Ticket')
    expect(ticket.body.price).toEqual(200)

})
