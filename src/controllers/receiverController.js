const Receiver = require('../models/receiverModel');

exports.createReceiver = async (req, res) => {
    try {
        const newReceiver = new Receiver(req.body);
        await newReceiver.save();
        res.status(201).json({ message: 'Recebedor criado com sucesso', receiver: newReceiver });
    } catch (error) {
        res.status(404).json({ message: 'Erro ao criar o recebedor', error: error.message });
    }
};

exports.listReceivers = async (req, res) => {
    try {
        const { status, receiver, pix_key_type, pix_key, page } = req.query;
        const limit = 10;

        const filter = {};
        if (status) filter.status = status;
        if (receiver) filter.receiver = receiver;
        if (pix_key_type) filter.pix_key_type = pix_key_type;
        if (pix_key) filter.pix_key = pix_key;

        const startIndex = (page - 1) * limit;

        const receivers = await Receiver.find(filter)
            .limit(limit)
            .skip(startIndex)
            .exec();

        res.status(200).json(receivers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar os recebedores', error: error.message });
    }
};

exports.updateReceiver = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        let updateData = req.body;

        if (status === 'validado') {
            delete updateData.pix_key_type;
            delete updateData.pix_key;
        }

        const updatedReceiver = await Receiver.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedReceiver) {
            return res.status(404).json({ message: 'Recebedor não encontrado' });
        }

        res.status(200).json({ message: 'Recebedor atualizado com sucesso', receiver: updatedReceiver });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar o recebedor', error: error.message });
    }
};

exports.deleteReceivers = async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await Receiver.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Recebedor(es) excluído(s) com sucesso', result });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao excluir o(s) recebedor(es)', error: error.message });
    }
};
