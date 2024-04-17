const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const users = {}; 
const PORT = 3000;

app.use((req, res, next) => {
    console.log(req.headers);
    next();
});

app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!users[email] || !await bcrypt.compare(password, users[email].password)) {
        return res.status(403).send("Invalid email or password");
    }

    const token = uuidv4();
    users[email].token = token;
    res.json({ token });
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { email, password: hashedPassword };
    res.status(201).send("User registered");
});

app.use((req, res, next) => {
    const token = req.headers.authorization;
    const user = Object.values(users).find(user => user.token === token);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(403).send("Access Denied");
    }
});

app.get('/restricted', (req, res) => {
    res.send(`<h1>Welcome ${req.user.email}</h1>`);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
