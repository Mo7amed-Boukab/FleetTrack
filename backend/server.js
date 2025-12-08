const dbConnection = require('./src/config/database');
const app = require('./src/app');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}); 