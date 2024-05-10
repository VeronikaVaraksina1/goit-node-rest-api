import 'dotenv/config';
import mongoose from "mongoose";

async function run() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.info("Database connection successful")
   } catch (error) {
    console.error(error)
    process.exit(1);
  }
}

run();