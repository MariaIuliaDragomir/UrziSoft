const request = require('supertest');
const app = require('../../app'); 

describe('Product Routes', () => {
    it('should respond with a list of products', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create a new product', async () => {
        const newProduct = { name: 'Test Product', price: 100 };
        const response = await request(app).post('/api/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newProduct.name);
    });

    it('should respond with a single product', async () => {
        const response = await request(app).get('/api/products/1');
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
    });

    it('should update a product', async () => {
        const updatedProduct = { name: 'Updated Product', price: 150 };
        const response = await request(app).put('/api/products/1').send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedProduct.name);
    });

    it('should delete a product', async () => {
        const response = await request(app).delete('/api/products/1');
        expect(response.status).toBe(204);
    });
});