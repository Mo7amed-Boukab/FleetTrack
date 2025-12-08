const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
   res.send('FleetTrack API is running ...');
});


module.exports = app;