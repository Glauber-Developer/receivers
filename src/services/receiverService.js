const Receiver = require('../models/receiverModel');

exports.createReceiver = async (receiverData) => {
    try {
        const newReceiver = new Receiver(receiverData);
        return await newReceiver.save();
    } catch (error) {
        throw new Error('Erro ao criar o recebedor: ' + error.message);
    }
};

exports.listReceivers = async (filter, page, limit) => {
    try {
        const startIndex = (page - 1) * limit;
        return await Receiver.find(filter)
            .limit(limit)
            .skip(startIndex)
            .exec();
    } catch (error) {
        throw new Error('Erro ao listar os recebedores: ' + error.message);
    }
};

exports.listReceiver = async (id) => {
    try {
        const receiver = await Receiver.findById(id);
        return receiver;
    } catch (error) {
        throw new Error('Erro ao buscar o receptor por ID: ' + error.message);
    }
};
exports.updateReceiver = async (id, updateData) => {
    try {
        return await Receiver.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
        throw new Error('Erro ao atualizar o recebedor: ' + error.message);
    }
};

exports.deleteReceivers = async (ids) => {
    try {
        return await Receiver.deleteMany({ _id: { $in: ids } });
    } catch (error) {
        throw new Error('Erro ao excluir o(s) recebedor(es): ' + error.message);
    }
};
