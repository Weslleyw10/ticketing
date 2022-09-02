import mongoose from "mongoose";

import { app } from "./app"

// Mongoose Connect
const startApp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_ERROR must be defined')
  }

  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

  } catch (err) {
      console.error(err);
  }

  app.listen(3000, () => {
    console.log("Tickets Listening on port 3000.");
  });
  
}

startApp();
