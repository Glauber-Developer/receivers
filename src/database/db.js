const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    //console.log('Conexão com o MongoDB estabelecida com sucesso');
}).catch((err) => {
    //console.error('Erro ao conectar ao MongoDB', err);
});
