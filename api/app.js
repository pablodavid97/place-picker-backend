import fs from 'node:fs/promises';
import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';

const app = express();

// Middleware
app.use(express.static('images'));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Routes
app.get('/places', async (req, res) => {
    const fileContent = await fs.readFile('./data/places.json');
    const placesData = JSON.parse(fileContent);
    res.status(200).json({ places: placesData });
});

app.get('/user-places', async (req, res) => {
    const fileContent = await fs.readFile('./data/user-places.json');
    const places = JSON.parse(fileContent);
    res.status(200).json({ places });
});

app.put('/user-places', async (req, res) => {
    const places = req.body.places;
    await fs.writeFile('./data/user-places.json', JSON.stringify(places));
    res.status(200).json({ message: 'User places updated!' });
});

// 404 Handler
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    res.status(404).json({ message: '404 - Not Found' });
});

// Export as Serverless Function
export default function handler(req, res) {
    const server = createServer(app);
    server.emit('request', req, res);
}
