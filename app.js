const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Home, Bienvenue');
});

const PORT = process.env.PORT || 3939;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
