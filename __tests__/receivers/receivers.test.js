const request = require('supertest');
const app = require('../../index'); 
const Receiver = require('../../src/models/receiverModel');
const mongoose = require("mongoose");
const { Request } = require('supertest');

beforeEach(async () => {
  await mongoose.connect('mongodb+srv://receiver:bHURnypTkEaNszji@cluster0.ukjvtoj.mongodb.net/');
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /api/receivers", () => {
  beforeEach(async () => {
    await Receiver.create([
      { receiver: "João", status: "Rascunho", pix_key_type: "CPF", pix_key: "123.456.789-00" },
      { receiver: "Maria", status: "Rascunho", pix_key_type: "CNPJ", pix_key: "12.345.678/0001-00" },
      { receiver: "José", status: "Validado", pix_key_type: "CPF", pix_key: "987.654.321-00" },
      { receiver: "João", status: "Rascunho", pix_key_type: "CPF", pix_key: "123.456.789-00" },
      { receiver: "João", status: "Rascunho", pix_key_type: "CNPJ", pix_key: "12.345.678/0001-00" },
      { receiver: "José", status: "Validado", pix_key_type: "CPF", pix_key: "987.654.321-00" },
      { receiver: "João", status: "Rascunho", pix_key_type: "CPF", pix_key: "123.456.789-00" },
      { receiver: "Maria", status: "Rascunho", pix_key_type: "CNPJ", pix_key: "12.345.678/0001-00" },
      { receiver: "José", status: "Validado", pix_key_type: "CPF", pix_key: "987.654.321-00" },
      { receiver: "José", status: "Rascunho", pix_key_type: "CPF", pix_key: "987.654.321-00" }
    ]);
  });

  it("should return all receivers", async () => {
    const res = await request(app).get("/api/receivers");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(3);
  });

  it("should return receivers filtered by status", async () => {
    const res = await request(app).get("/api/receivers").query({ status: "Rascunho" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(10); 
    expect(res.body.every(receiver => receiver.status === 'Rascunho')).toBe(true);
  });

  it("should return receivers filtered by receiver", async () => {
    const res = await request(app).get("/api/receivers").query({ receiver: "João" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(10); 
    expect(res.body.every(receiver => receiver.receiver === 'João')).toBe(true);
  });

  it("should handle errors", async () => {
    jest.spyOn(Receiver, 'find').mockRejectedValueOnce(new Error('Erro ao listar os recebedores'));

    try {
      await request(app).get("/api/receiver");
    } catch (error) {
      expect(error.message).toContain('Erro ao listar os recebedores');
    }
  });
  
});

describe("POST /api/receivers", () => {
  it("should create a Receiver", async () => {
    const res = await request(app).post("/api/receivers").send({
      pix_key_type: 'CPF',
      pix_key: '123.456.789-00',
      email: 'exemplo@email.com',
      status: 'Rascunho',
    });
    expect(res.statusCode).toBe(201);
  });

  it('should create a new receiver with empty input data', async () => {
    const response = await request(app)
     .post('/receivers')
     .send({});

    expect(response.status).toBe(404);
    
  });

  it('should return 400 status when creating a receiver with invalid input data', async () => {
    const response = await request(app)
     .post('/receivers')
     .send({ invalid: 'data' });

    expect(response.status).toBe(404);
  });

  it('should return 400 status when creating a receiver without required fields', async () => {
    const response = await request(app)
     .post('/receivers')
     .send({ receiver: 'John Doe' });

    expect(response.status).toBe(404);
  });

  it('should return 400 status when creating a receiver with duplicate pix_key', async () => {
    const existingReceiver = new Receiver({
      receiver: 'John Doe',
      pix_key_type: 'CPF',
      pix_key: '12345678901',
    });
    await existingReceiver.save();

    const response = await request(app)
     .post('/receivers')
     .send({
        receiver: 'Jane Doe',
        pix_key_type: 'CPF',
        pix_key: '12345678901',
      });

    expect(response.status).toBe(404);
  });

  it('should return 400 status when creating a receiver with invalid pix_key_type', async () => {
    const response = await request(app)
     .post('/receivers')
     .send({
        receiver: 'John Doe',
        pix_key_type: 'invalid',
        pix_key: '12345678901',
      });

    expect(response.status).toBe(404);
  });
});

describe('PUT /api/receivers/:id', () => {
  it('should update a Receiver', async () => {
    const initialReceiver = await Receiver.create({
      pix_key_type: 'CPF',
      pix_key: '123.456.789-00',
      email: 'exemplo@email.com',
      status: 'Rascunho'
    });

    jest.spyOn(Receiver, 'findByIdAndUpdate').mockResolvedValueOnce({
      _id: initialReceiver._id,
      pix_key_type: initialReceiver.pix_key_type,
      pix_key: initialReceiver.pix_key,
      email: initialReceiver.email,
      status: 'Validado'
    });

    const res = await request(app)
      .put(`/api/receivers/${initialReceiver._id}`)
      .send({ status: 'Validado' });


    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual('Recebedor atualizado com sucesso');
    expect(res.body.receiver).toBeDefined(); 
  });

  it('should return 400 when updating a receiver with an incorrect ID format', async () => {
    const initialReceiver = {
      _id: 'non-existent-id',
      pix_key_type: 'CPF',
      pix_key: '123.456.789-00',
      email: 'exemplo@email.com',
      status: 'Rascunho',
    };

    const res = await request(app)
      .put(`/api/receivers/${initialReceiver._id}`)
      .send({ status: 'Validado' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Erro ao atualizar o recebedor');
  });

  it('should return 400 when updating a receiver with an empty ID', async () => {
    const res = await request(app)
      .put(`/api/receivers/`)
      .send({ status: 'Validado' });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 when updating a receiver with a null ID', async () => {
    const res = await request(app)
      .put(`/api/receivers/null`)
      .send({ status: 'Validado' });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 when updating a receiver with an undefined ID', async () => {
    const res = await request(app)
      .put(`/api/receivers/undefined`)
      .send({ status: 'Validado' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Erro ao atualizar o recebedor');
  });

  it('should return 400 when updating a receiver with a non-string ID', async () => {
    const res = await request(app)
      .put(`/api/receivers/123`)
      .send({ status: 'Validado' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Erro ao atualizar o recebedor');
  });

});

describe('DELETE /api/receivers', () => {
  it('should delete multiple Receivers', async () => {
    const receiverIds = [
      'id_do_receptor_1',
      'id_do_receptor_2',
      'id_do_receptor_3'
    ];

    jest.spyOn(Receiver, 'deleteMany').mockResolvedValueOnce({
      n: receiverIds.length, 
      ok: 1 
    });

    const res = await request(app)
      .delete('/api/receivers')
      .send({ ids: receiverIds });

    expect(Receiver.deleteMany).toHaveBeenCalledWith({ _id: { $in: receiverIds } });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toEqual('Recebedor(es) excluído(s) com sucesso');
    expect(res.body.result).toEqual({ n: receiverIds.length, ok: 1 });
  });
});

describe("Validation of pix_key format", () => {
  it("should validate CPF format", () => {
    const model = new Receiver({ pix_key_type: "CPF" });
    model.pix_key = "123.456.789-00";
    expect(model.validateSync()).toBeUndefined();
  });

  it("should validate CNPJ format", () => {
    const model = new Receiver({ pix_key_type: "CNPJ" });
    model.pix_key = "12.345.678/0001-00";
    expect(model.validateSync()).toBeUndefined();
  });

  it("should validate EMAIL format", () => {
    const model = new Receiver({ pix_key_type: "EMAIL" });
    model.pix_key = "user@example.com";
    expect(model.validateSync()).toBeUndefined();
  });

  it("should validate TELEFONE format", () => {
    const model = new Receiver({ pix_key_type: "TELEFONE" });
    model.pix_key = "+5551345678901";
    expect(model.validateSync()).toBeUndefined();
  });

  it("should validate CHAVE_ALEATORIA format", () => {
    const model = new Receiver({ pix_key_type: "CHAVE_ALEATORIA" });
    model.pix_key = "abcdef12-3456-7890-abcd-ef1234567890";
    expect(model.validateSync()).toBeUndefined();
  });
});
