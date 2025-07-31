require('dotenv').config(); // Load environment variables

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OTX_API_KEY; // Load from .env file

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

// ===== ROUTES =====

// Fetch threat intelligence data
app.get('/api/threats', async (req, res) => {
    const apiUrl = 'https://otx.alienvault.com/api/v1/pulses/subscribed';

    try {
        const response = await axios.get(apiUrl, {
            headers: { 'X-OTX-API-KEY': apiKey }
        });

        if (response.data?.results) {
            const threats = response.data.results.map(pulse => ({
                indicator: pulse.name,
                type: pulse.pulse_info?.indicator_type || 'Unknown',
                description: pulse.description,
                created: pulse.created
            }));
            res.json(threats);
        } else {
            res.status(500).json({ error: 'Invalid response from OTX API' });
        }
    } catch (error) {
        console.error('Threat fetch error:', error.message);
        res.status(500).json({ error: 'Error fetching data from OTX' });
    }
});

// Submit file and get threat result
app.post('/api/submit-file', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path));

        const submitUrl = 'https://otx.alienvault.com/api/v1/indicators/submit_file';
        const response = await axios.post(submitUrl, formData, {
            headers: {
                'X-OTX-API-KEY': apiKey,
                ...formData.getHeaders()
            }
        });

        const resultData = response.data;

        // Get more details about the file
        const detailUrl = `https://otx.alienvault.com/api/v1/indicators/file/${file.filename}/general`;
        const detailResponse = await axios.get(detailUrl, {
            headers: { 'X-OTX-API-KEY': apiKey }
        });

        res.json({
            message: 'File submitted successfully',
            submissionResult: resultData,
            detailResult: detailResponse.data
        });
    } catch (error) {
        console.error('File submission error:', error.message);
        res.status(500).json({ error: 'Error submitting file or fetching details' });
    }
});

// Submit URL and get threat result
app.post('/api/submit-url', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    try {
        const submitUrl = 'https://otx.alienvault.com/api/v1/indicators/submit_url';
        const response = await axios.post(submitUrl, { url }, {
            headers: {
                'X-OTX-API-KEY': apiKey,
                'Content-Type': 'application/json'
            }
        });

        const resultData = response.data;

        // Get more details about the URL
        const encodedUrl = encodeURIComponent(url);
        const detailUrl = `https://otx.alienvault.com/api/v1/indicators/url/${encodedUrl}/general`;
        const detailResponse = await axios.get(detailUrl, {
            headers: { 'X-OTX-API-KEY': apiKey }
        });

        res.json({
            message: 'URL submitted successfully',
            submissionResult: resultData,
            detailResult: detailResponse.data
        });
    } catch (error) {
        console.error('URL submission error:', error.message);
        res.status(500).json({ error: 'Error submitting URL or fetching details' });
    }
});
