const receiverService = require('../services/receiverService');

exports.createReceiver = async (req, res) => {
    try {
        const newReceiver = await receiverService.createReceiver(req.body);
        res.status(201).json({ message: 'Recebedor criado com sucesso', receiver: newReceiver });
    } catch (error) {
        res.status(404).json({ message: error.message });
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

        const receivers = await receiverService.listReceivers(filter, page, limit);
        res.status(200).json(receivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listReceiver = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const receiver = await receiverService.listReceiver(receiverId);

        if (!receiver) {
            return res.status(404).json({ message: 'Receptor não encontrado' });
        }

        res.status(200).json(receiver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateReceiver = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, email, ...updateData } = req.body;

        if (status === 'validado') {
            const updatedReceiver = await receiverService.updateReceiver(id, { email });
            if (!updatedReceiver) {
                return res.status(404).json({ message: 'Recebedor não encontrado' });
            }
            return res.status(200).json({ message: 'Recebedor atualizado com sucesso', receiver: updatedReceiver });
        } else if (status === 'rascunho') {
            const { email } = req.body;
            const updatedReceiver = await receiverService.updateReceiver(id, { email, ...updateData} );
            if (!updatedReceiver) {
                return res.status(404).json({ message: 'Recebedor não encontrado' });
            }
            return res.status(200).json({ message: 'Recebedor atualizado com sucesso', receiver: updatedReceiver });
        } else {
            return res.status(400).json({ message: 'O status do recebedor não pode ser alterado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteReceivers = async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await receiverService.deleteReceivers(ids);
        res.status(200).json({ message: 'Recebedor(es) excluído(s) com sucesso', result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
