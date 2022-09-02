import express, { Request, Response } from "express";

import { currentUser } from '@wlsticketing/common'

const router = express.Router();

router.get('/api/users/currentuser', 
currentUser,  
async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
})

export { router as currentUserRouter }