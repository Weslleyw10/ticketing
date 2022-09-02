import express, { Request, Response } from "express";
import { body } from 'express-validator'
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@wlsticketing/common'

import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must suppy a password')
],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })

    if (!user) {
        throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(
        user.password,
        password
    )

    if (!passwordMatch) {
        throw new BadRequestError('Invalid credentials');
    }

    // generate JWT
    const userJWT = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!)

    // Store it on session object
    req.session = {
        jwt: userJWT
    }

    res.status(200).send(user);


})


export { router as signInRouter }
