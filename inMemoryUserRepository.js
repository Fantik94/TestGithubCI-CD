const bcrypt = require('bcryptjs');
const db = require('./database');

async function registerUser(email="test@test.fr", password='test', role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [rows] = await db.execute(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role]
    );
    return rows;
}

async function checkCredentials(email, password) {
    const [rows] = await db.execute(
        'SELECT password FROM users WHERE email = ?',
        [email]
    );
    if (rows.length > 0) {
        const user = rows[0];
        return bcrypt.compareSync(password, user.password);
    }
    return false;
}

module.exports = {
    registerUser,
    checkCredentials
};
