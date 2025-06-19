const express = require('express');
const connectDB = require('./config/connectDB');
const dotenv = require('dotenv');
const cors = require('cors');
const router = require('./routes/login');
const app = express();
dotenv.config();

connectDB();

app.use(cors([
    {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
]));
app.use(express.json());

app.use("/api/login", router)