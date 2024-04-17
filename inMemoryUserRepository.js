const bcrypt = require('bcryptjs');


let registeredUsers = {
    "user@example.com": {
        email: "user@example.com",
        password: bcrypt.hashSync("password123", 10) 
    },
    "another@example.com": {
        email: "another@example.com",
        password: bcrypt.hashSync("anotherPassword", 10)
    }
};

function getRegisteredUsers() {
    return registeredUsers;
}

function registerUser(email, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    registeredUsers[email] = { email, password: hashedPassword };
}

function checkCredentials(email, password) {
    const user = registeredUsers[email];
    return user && bcrypt.compareSync(password, user.password);
}

module.exports = {
    getRegisteredUsers,
    registerUser,
    checkCredentials
};
