// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://receiver:bHURnypTkEaNszji@cluster0.ukjvtoj.mongodb.net/';

app.use(cors());
app.use(bodyParser.json());

app.use('/api/receivers', require('./src/routes/receivers'));

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conexão com o MongoDB estabelecida com sucesso');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
});

module.exports = app;
