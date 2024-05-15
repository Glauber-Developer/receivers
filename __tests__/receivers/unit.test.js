const { createReceiver, listReceivers, listReceiver, updateReceiver, deleteReceivers } = require('../../src/services/receiverService');
const Receiver = require('../../src/models/receiverModel');
const mongoose = require("mongoose");

jest.mock('../../src/models/receiverModel');


beforeEach(async () => {
    await mongoose.connect('mongodb+srv://receiver:bHURnypTkEaNszji@cluster0.ukjvtoj.mongodb.net/');
});

afterEach(async () => {
    await mongoose.connection.close();
});
describe('Receiver Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createReceiver', () => {
        it('should create a new receiver with valid data', async () => {
            const receiverData = { receiver: 'John Doe', pix_key_type: 'CPF', pix_key: '123.456.789-00' };
            const savedReceiver = { _id: '123', ...receiverData };
            Receiver.mockReturnValueOnce({
                save: jest.fn().mockResolvedValue(savedReceiver),
            });

            const result = await createReceiver(receiverData);
            expect(result).toEqual(savedReceiver);
        });
    });

    describe('listReceivers function', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should list receivers with given filter, page, and limit', async () => {
            const filter = { receiver: 'John Doe' };
            const page = 1;
            const limit = 10;

            const startIndex = (page - 1) * limit;
            const receivers = [
                { receiver: 'John Doe', pix_key_type: 'CPF', pix_key: '123.456.789-00' },
                { receiver: 'John Doe', pix_key_type: 'CPF', pix_key: '123.456.789-00' },
                { receiver: 'John Doe', pix_key_type: 'CPF', pix_key: '123.456.789-00' }];

            Receiver.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(receivers)
            });

            const result = await listReceivers(filter, page, limit);

            expect(Receiver.find).toHaveBeenCalledWith(filter);
            expect(Receiver.find().limit).toHaveBeenCalledWith(limit);
            expect(Receiver.find().skip).toHaveBeenCalledWith(startIndex);
            expect(result).toEqual(receivers);
        });

        it('should throw an error when listing receivers fails', async () => {
            const filter = {};
            const page = 1;
            const limit = 10;

            const error = new Error('Failed to list receivers');
            Receiver.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(error)
            });

            await expect(listReceivers(filter, page, limit)).rejects.toThrow('Erro ao listar os recebedores: Failed to list receivers');
        });
    });

    describe('listReceiver function', () => {
        it('should find receiver by ID', async () => {
            const id = '123456789012345678901234';
            const receiver = { _id: id, receiver: 'John Doe', pix_key_type: 'CPF', pix_key: '123.456.789-00' };

            Receiver.findById.mockResolvedValue(receiver);

            const result = await listReceiver(id);

            expect(Receiver.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(receiver);
        });

        it('should throw an error if failed to find receiver by ID', async () => {
            const id = 'invalidID';

            Receiver.findById.mockRejectedValue(new Error('Erro ao buscar o receptor por ID: Cannot find receiver'));

            await expect(listReceiver(id)).rejects.toThrowError('Erro ao buscar o receptor por ID: Cannot find receiver');
        });
    });

    describe('updateReceiver function', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should update a receiver with given id and update data', async () => {
            const id = '123';
            const updateData = {
                receiver: 'Nome',
                pix_key_type: 'CPF',
                pix_key: '123.456.789-00',
                email: 'novoemail@example.com',
            };

            const updatedReceiver = {
                _id: '123',
                receiver: 'Novo Nome',
                pix_key_type: 'CPF',
                pix_key: '123.456.789-00',
                email: 'novoemail@example.com',
            };

            Receiver.findByIdAndUpdate.mockResolvedValue(updatedReceiver);

            const result = await updateReceiver(id, updateData);

            expect(Receiver.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, { new: true });
            expect(result).toEqual(updatedReceiver);
        });

        it('should throw an error when updating receiver fails', async () => {
            const id = '123';
            const updateData = {
                receiver: 'Nome',
                pix_key_type: 'CPF',
                pix_key: '123.456.789-00',
                email: 'novoemail@example.com',
            };

            const error = new Error('Failed to update receiver');
            Receiver.findByIdAndUpdate.mockRejectedValue(error);

            await expect(updateReceiver(id, updateData)).rejects.toThrow('Erro ao atualizar o recebedor: Failed to update receiver');
        });
    });

    describe('deleteReceivers', () => {
        it('should delete receivers with given ids', async () => {
            const ids = ['1', '2', '3'];
            const deleteResult = { deletedCount: 3 };
            Receiver.deleteMany.mockResolvedValueOnce(deleteResult);

            const result = await deleteReceivers(ids);
            expect(result).toEqual(deleteResult);
        });
    });
});
