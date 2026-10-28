import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import app from './app.js';
import { connectDB } from './config/db.js';
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });
const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API listening on ${port}`))).catch(err => { console.error('Database connection failed:', err.message); process.exit(1); });
