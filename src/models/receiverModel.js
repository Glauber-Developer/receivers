const mongoose = require('mongoose');

const receiverSchema = new mongoose.Schema({
    receiver: {
        type: String,
        maxLength: 250,
        required: false,
    },
    pix_key_type: {
        type: String,
        required: true,
        enum: ['CPF', 'CNPJ', 'EMAIL', 'TELEFONE', 'CHAVE_ALEATORIA']
    },
    pix_key: {
        type: String,
        maxLength: 140,
        required: true,
        validate: {
            validator: function (value) {
                if (this.pix_key_type === 'CPF') {
                    return /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}$/.test(value);
                } else if (this.pix_key_type === 'CNPJ') {
                    return /^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}$/.test(value);
                } else if (this.pix_key_type === 'EMAIL') {
                    return /^[a-z0-9+_.-]+@[a-z0-9.-]+$/.test(value);
                } else if (this.pix_key_type === 'TELEFONE') {
                    return /^((?:\+?55)?)([1-9][0-9])(9[0-9]{8})$/.test(value);
                } else if (this.pix_key_type === 'CHAVE_ALEATORIA') {
                    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
                } else {
                    return false;
                }
            },
            message: props => `${props.value} não é um formato válido para ${this.pix_key_type}`
        }
    },
    email: {
        type: String,
        maxLength: 250,
        required: false,
        match: /^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/i
    },
    cpf: {
        type: String,
        maxLength: 140,
        required: false,
        math: /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}$/i,
    },
    cnpj: {
        type: String,
        maxLength: 140,
        required: false,
        math: /^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}$/i
    },
    status: { type: String, default: 'Rascunho' }
});

module.exports = mongoose.model('Receiver', receiverSchema);
