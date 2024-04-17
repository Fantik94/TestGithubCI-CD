const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { checkCredentials, registerUser } = require('./inMemoryUserRepository');

const app = express();
app.use(express.json());
const PORT = 3000;

let authenticatedUsers = {};

app.use((req, res, next) => {
    console.log(req.headers);
    next();
});

// Authentication endpoint
app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    if (await checkCredentials(email, password)) {
        const token = uuidv4();
        authenticatedUsers[token] = { email };
        res.json({ token });
    } else {
        res.status(403).send("Invalid email or password");
    }
});

app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        await registerUser(email, password, role);
        res.status(201).send("User registered");
    } catch (error) {
        console.log(error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).send("User already exists");
        } else {
            res.status(500).send("Error registering user: " + error.message);
        }
    }
});

app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token in authenticatedUsers) {
        req.user = authenticatedUsers[token];
        next();
    } else {
        res.status(403).send("Access Denied");
    }
});

// A restricted route
app.get('/restricted', (req, res) => {
    res.send(`<h1>Welcome ${req.user.email}</h1>`);
});

// Listen on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
