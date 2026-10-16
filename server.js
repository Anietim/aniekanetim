/**
 * Aniekan Etim Portfolio Backend - Production Server Core (Fixed Route Ordering)
 * Features: Native HTTP Basic Authentication Gatekeeper & Live CRUD API Engine
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8090; // Locks into port 8090 to bypass port 3000 conflicts
const DATABASE_PATH = path.join(__dirname, 'data', 'database.json');

// Global stream handling parser configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 1. STATIC ASSET LAYER (MOVED UP)
 * Serves index.html, style.css, and client scripts to your browser instantly.
 */
app.use(express.static(__dirname));

/**
 * 2. Absolute Server-Level Authentication Gatekeeper
 * Intercepts requests for the admin panel and blocks unauthorized traffic.
 */
function adminSecurityGate(req, res, next) {
    const secureKey = process.env.PORTFOLIO_ADMIN_KEY || "MyPortfolioSecret2026";
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Admin Area"');
        return res.status(401).send('Authentication Required: Access Denied.');
    }

    const authTokens = Buffer.from(authHeader.split(' '), 'base64').toString().split(':');
    const password = authTokens[1]; // Correct array index offset mapping for password validation

    if (password === secureKey) {
        return next(); // Key matches, open the gate
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Admin Area"');
    return res.status(401).send('Authentication Failed: Invalid credentials.');
}

/**
 * 3. Protected Routes — Authenticated administrators only
 */
app.get('/admin', adminSecurityGate, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', adminSecurityGate, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Protect the API database write action route
app.post('/api/projects', adminSecurityGate, (req, res) => {
    const { title, role, description, liveUrl, tags } = req.body;

    if (!title || !role || !description || !liveUrl) {
        return res.status(400).json({ error: 'Validation Error: Missing node attributes.' });
    }

    fs.readFile(DATABASE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Database filesystem read breakdown.' });

        let currentDatabase = JSON.parse(data || '[]');
        const cleanId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-\$)/g, '');
        
        const newProject = {
            id: `${cleanId}-${Date.now().toString().slice(-4)}`,
            title,
            role,
            description,
            liveUrl,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(Boolean),
            featured: true
        };

        currentDatabase.push(newProject);

        fs.writeFile(DATABASE_PATH, JSON.stringify(currentDatabase, null, 2), 'utf8', (writeErr) => {
            if (writeErr) return res.status(500).json({ error: 'Failed to write record to disk storage.' });
            res.status(201).json({ message: 'Success', record: newProject });
        });
    });
});

/**
 * 4. Public API Routes — Available to your homepage grid renderer
 */
app.get('/api/projects', (req, res) => {
    fs.readFile(DATABASE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read public database records.' });
        res.json(JSON.parse(data || '[]'));
    });
});

// Explicit base route fallback target to ensure index.html renders cleanly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start your listener thread loop
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 ANIEKAN.PORTFOLIO FULL-STACK ENGINE LIVE ONLINE`);
    console.log(`🌐 Portfolio Homepage: http://localhost:${PORT}`);
    console.log(`🔒 Secure Dashboard Area: http://localhost:${PORT}/admin`);
    console.log(`======================================================\n`);
});
