const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Home, Bienvenue');
});

const PORT = process.env.PORT || 3939;
const HOST = '0.0.0.0'; 
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
