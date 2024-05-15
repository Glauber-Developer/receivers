const request = require('supertest');
const app = require('../../index');
const receiverService = require('../../src/services/receiverService');
const mongoose = require('mongoose');
const Receiver = require('../../src/models/receiverModel');

jest.mock('../../src/services/receiverService');


describe('Receiver Controller (Integration Test)', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('createReceiver should return 201 status and a new receiver when successful', async () => {
        const requestBody = {
            receiver: 'John Doe',
            pix_key_type: 'CPF',
            pix_key: '123.456.789-00',
            email: 'johndoe@example.com'
        };
        const newReceiver = {
            _id: '123',
            ...requestBody
        };

        receiverService.createReceiver.mockResolvedValue(newReceiver);

        const response = await request(app)
            .post('/api/receivers')
            .send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Recebedor criado com sucesso', receiver: newReceiver });
    });

    it('listReceivers should return 200 status and a list of receivers when successful', async () => {
        const filters = { status: 'Rascunho' };
        const page = 1;
        const limit = 10;
        const receivers = [{ receiver: 'John Doe' }, { receiver: 'Jane Doe' }];

        receiverService.listReceivers.mockResolvedValue(receivers);

        const response = await request(app)
            .get('/api/receivers')
            .query({ ...filters, page, limit });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(receivers);
    });

    it('listReceiver should return receiver data when found', async () => {
        const receiverId = '123';
        const receiverData = { _id: receiverId, receiver: 'John Doe', email: 'john@example.com' };
        receiverService.listReceiver.mockResolvedValue(receiverData);

        const response = await request(app).get(`/api/receivers/${receiverId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(receiverData);
    });

    it('listReceiver should return error if receiver is not found', async () => {
        const receiverId = '123';
        receiverService.listReceiver.mockResolvedValue(null);

        const response = await request(app).get(`/api/receivers/${receiverId}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Receptor não encontrado' });
    });

    it('listReceiver should return error if an internal server error occurs', async () => {
        const receiverId = '123';
        const errorMessage = 'Erro interno no servidor';
        receiverService.listReceiver.mockRejectedValue(new Error(errorMessage));

        const response = await request(app).get(`/api/receivers/${receiverId}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: errorMessage });
    });

    it('updateReceiver should return 200 status and the updated receiver when successful', async () => {
        const receiverId = '123';
        const updatedReceiver = { _id: receiverId, receiver: 'John Updated', status: 'rascunho' };
        const updateData = { receiver: 'John Updated', status: 'rascunho' };

        receiverService.updateReceiver.mockResolvedValue(updatedReceiver);

        const response = await request(app)
            .put(`/api/receivers/${receiverId}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Recebedor atualizado com sucesso', receiver: updatedReceiver });
    });

    it('updateReceiver should update receiver email when status is "validado"', async () => {
        const receiverId = '123';
        const updateData = { status: 'validado', email: 'newemail@example.com' };
        const updatedReceiver = { id: '123', email: 'newemail@example.com' };
        receiverService.updateReceiver.mockResolvedValue(updatedReceiver);

        const response = await request(app)
            .put(`/api/receivers/${receiverId}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Recebedor atualizado com sucesso', receiver: updatedReceiver });
    });

    it('updateReceiver should update receiver fields when status is "rascunho"', async () => {
        const receiverId = '123';
        const updateData = { status: 'rascunho', email: 'newemail@example.com', receiver: 'New Receiver' };
        const updatedReceiver = { id: '123', email: 'newemail@example.com', receiver: 'New Receiver' };
        receiverService.updateReceiver.mockResolvedValue(updatedReceiver);

        const response = await request(app)
            .put(`/api/receivers/${receiverId}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Recebedor atualizado com sucesso', receiver: updatedReceiver });
    });

    it('updateReceiver should return error if status is neither "validado" nor "rascunho"', async () => {
        const receiverId = '123';
        const updateData = { status: 'outro' };

        const response = await request(app)
            .put(`/api/receivers/${receiverId}`)
            .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'O status do recebedor não pode ser alterado' });
    });

    it('updateReceiver should return error if receiver is not found', async () => {
        const receiverId = '123';
        const updateData = { status: 'rascunho', email: 'newemail@example.com' };
        receiverService.updateReceiver.mockResolvedValue(null);

        const response = await request(app)
            .put(`/api/receivers/${receiverId}`)
            .send(updateData);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Recebedor não encontrado' });
    });

    it('updateReceiver should return error if updateReceiver throws an error', async () => {
        const receiverId = '123';
        const updateData = { status: 'rascunho', email: 'newemail@example.com' };
        const errorMessage = 'Erro ao atualizar o recebedor';
        receiverService.updateReceiver.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .put(`/api/receivers/${receiverId}`)
            .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: errorMessage });
    });

    it('deleteReceivers should return 200 status and a success message when successful', async () => {
        const receiverIds = ['123', '456'];
        const deleteResult = { n: 2, ok: 1 };

        receiverService.deleteReceivers.mockResolvedValue(deleteResult);

        const response = await request(app)
            .delete('/api/receivers')
            .send({ ids: receiverIds });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Recebedor(es) excluído(s) com sucesso', result: deleteResult });
    });


    //ERROR

    it('createReceiver should return 404 status and an error message when receiverService throws an error', async () => {
        const requestBody = {
            receiver: 'John Doe',
            pix_key_type: 'CPF',
            pix_key: '123.456.789-00',
            email: 'johndoe@example.com'
        };
        const errorMessage = 'Failed to create receiver';

        receiverService.createReceiver.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .post('/api/receivers')
            .send(requestBody);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: errorMessage });
    });

    it('listReceivers should return 500 status and an error message when receiverService throws an error', async () => {
        const filters = { status: 'active' };
        const page = 1;
        const limit = 10;
        const errorMessage = 'Failed to list receivers';

        receiverService.listReceivers.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .get('/api/receivers')
            .query({ ...filters, page, limit });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: errorMessage });
    });

    it('updateReceiver should return 400 status and an error message when receiverService throws an error', async () => {
        const receiverId = '123';
        const updateData = { receiver: 'John Updated' };
        const errorMessage = 'O status do recebedor não pode ser alterado';

        receiverService.updateReceiver.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .put(`/api/receivers/${receiverId}`)
            .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: errorMessage });
    });

    it('deleteReceivers should return 400 status and an error message when receiverService throws an error', async () => {
        const receiverIds = ['123', '456'];
        const errorMessage = 'Failed to delete receivers';

        receiverService.deleteReceivers.mockRejectedValue(new Error(errorMessage));

        const response = await request(app)
            .delete('/api/receivers')
            .send({ ids: receiverIds });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: errorMessage });
    });
});

//MODEL

describe('Receiver Model (Integration Test)', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://receiver:bHURnypTkEaNszji@cluster0.ukjvtoj.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should save a receiver to the database', async () => {
        const receiverData = {
            receiver: 'John Doe',
            pix_key_type: 'CPF',
            pix_key: '123.456.789-01',
            email: 'johndoe@example.com',
            cpf: '123.456.789-01',
            status: 'Rascunho'
        };

        const savedReceiver = await new Receiver(receiverData).save();

        expect(savedReceiver).toMatchObject(receiverData);
    });

    //VALIDATE

    describe("Validation of pix_key format", () => {
        it("should validate CPF format", () => {
            const model = new Receiver({ pix_key_type: "CPF" });
            model.pix_key = "123.456.789-00";
            model.receiver = "Receiver"
            expect(model.validateSync()).toBeUndefined();
        });

        it("should validate CNPJ format", () => {
            const model = new Receiver({ pix_key_type: "CNPJ" });
            model.pix_key = "12.345.678/0001-00";
            model.receiver = "Receiver"
            expect(model.validateSync()).toBeUndefined();
        });

        it("should validate EMAIL format", () => {
            const model = new Receiver({ pix_key_type: "EMAIL" });
            model.pix_key = "user@example.com";
            model.receiver = "Receiver"
            expect(model.validateSync()).toBeUndefined();
        });

        it("should validate TELEFONE format", () => {
            const model = new Receiver({ pix_key_type: "TELEFONE" });
            model.pix_key = "+5551345678901";
            model.receiver = "Receiver"
            expect(model.validateSync()).toBeUndefined();
        });

        it("should validate CHAVE_ALEATORIA format", () => {
            const model = new Receiver({ pix_key_type: "CHAVE_ALEATORIA" });
            model.pix_key = "abcdef12-3456-7890-abcd-ef1234567890";
            model.receiver = "Receiver"
            expect(model.validateSync()).toBeUndefined();
        });
    });
});
