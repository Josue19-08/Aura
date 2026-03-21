// Entry point that loads environment variables before any other imports
import dotenv from 'dotenv';

// Load .env file FIRST
dotenv.config();

// Now import and run the app
import('./src/index.js');
