const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('User Management Service is up and running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
