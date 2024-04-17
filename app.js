const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { checkCredentials, registerUser } = require('./inMemoryUserRepository');

const app = express();
app.use(express.json());
const PORT = 3000;

let authenticatedUsers = {};

app.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    if (checkCredentials(email, password)) {
        const token = uuidv4();
        authenticatedUsers[token] = { email };
        res.json({ token });
    } else {
        res.status(403).send("Invalid email or password");
    }
});

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    registerUser(email, password);
    res.status(201).send("User registered");
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

app.get('/restricted', (req, res) => {
    res.send(`<h1>Welcome ${req.user.email}</h1>`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
