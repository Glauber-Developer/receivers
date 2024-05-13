const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/receivers', require('./src/routes/receivers'));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://receiver:bHURnypTkEaNszji@cluster0.ukjvtoj.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conexão com o MongoDB estabelecida com sucesso'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB', err));
