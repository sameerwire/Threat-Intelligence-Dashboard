const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

const apiKey = '59dd2a27aa90649e71afb81bff16b4a659a36b1fc33268c08f89747f545e962b'; 

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Define API route to fetch threat intelligence data
app.get('/api/threats', async (req, res) => {
    const apiUrl = 'https://otx.alienvault.com/api/v1/pulses/subscribed';

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'X-OTX-API-KEY': apiKey
            }
        });

        if (response.data && response.data.results) {
            const threats = response.data.results.map(pulse => ({
                indicator: pulse.name,
                type: pulse.pulse_info ? pulse.pulse_info.indicator_type : 'Unknown',
                description: pulse.description,
                created: pulse.created
            }));
            res.json(threats);
        } else {
            res.status(500).json({ error: 'Invalid response from API' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from API' });
    }
});

// Define API route to submit a file and fetch its result
app.post('/api/submit-file', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path));

        const apiUrl = 'https://otx.alienvault.com/api/v1/indicators/submit_file';
        const response = await axios.post(apiUrl, formData, {
            headers: {
                'X-OTX-API-KEY': apiKey,
                ...formData.getHeaders()
            }
        });

        const resultData = response.data;

        // Fetch details of the submitted file
        const detailUrl = `https://otx.alienvault.com/api/v1/indicators/file/${file.filename}/general`;
        const detailResponse = await axios.get(detailUrl, {
            headers: {
                'X-OTX-API-KEY': apiKey
            }
        });

        res.json({
            message: 'File submitted successfully',
            submissionResult: resultData,
            detailResult: detailResponse.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting file or fetching details' });
    }
});

// Define API route to submit a URL and fetch its result
app.post('/api/submit-url', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const apiUrl = 'https://otx.alienvault.com/api/v1/indicators/submit_url';
        const response = await axios.post(apiUrl, { url }, {
            headers: {
                'X-OTX-API-KEY': apiKey,
                'Content-Type': 'application/json'
            }
        });

        const resultData = response.data;

        // Fetch details of the submitted URL
        const encodedUrl = encodeURIComponent(url);
        const detailUrl = `https://otx.alienvault.com/api/v1/indicators/url/${encodedUrl}/general`;
        const detailResponse = await axios.get(detailUrl, {
            headers: {
                'X-OTX-API-KEY': apiKey
            }
        });

        res.json({
            message: 'URL submitted successfully',
            submissionResult: resultData,
            detailResult: detailResponse.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting URL or fetching details' });
    }
});
