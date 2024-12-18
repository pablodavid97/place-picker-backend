import fs from 'fs/promises';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

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

// Function to resolve file paths
const resolveFilePath = (fileName) =>
    path.resolve(process.cwd(), 'data', fileName);

app.get('/places', async (req, res) => {
    try {
        const filePath = resolveFilePath('places.json');
        const fileContent = await fs.readFile(filePath);
        const placesData = JSON.parse(fileContent);
        res.status(200).json({ places: placesData });
    } catch (error) {
        res.status(500).json({
            message: 'Error reading places data',
            error: error.message,
        });
    }
});

app.get('/user-places', async (req, res) => {
    try {
        const filePath = resolveFilePath('user-places.json');
        const fileContent = await fs.readFile(filePath);
        const places = JSON.parse(fileContent);
        res.status(200).json({ places });
    } catch (error) {
        res.status(500).json({
            message: 'Error reading user places data',
            error: error.message,
        });
    }
});

app.put('/user-places', async (req, res) => {
    try {
        const places = req.body.places;
        const filePath = resolveFilePath('user-places.json');
        await fs.writeFile(filePath, JSON.stringify(places));
        res.status(200).json({ message: 'User places updated!' });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user places',
            error: error.message,
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: '404 - Not Found' });
});

// Export as Serverless Function
export default app;
