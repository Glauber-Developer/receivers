require('dotenv').config();

const app = require('./server.js');
require('./src/database/db.js');

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}
module.exports = app;