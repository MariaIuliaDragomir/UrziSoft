const productService = require('./productService');

test('should create a product', () => {
	const product = { name: 'Test Product', price: 100 };
	const createdProduct = productService.createProduct(product);
	expect(createdProduct).toHaveProperty('id');
	expect(createdProduct.name).toBe(product.name);
	expect(createdProduct.price).toBe(product.price);
});

test('should get a product by id', () => {
	const productId = 1;
	const product = productService.getProductById(productId);
	expect(product).toHaveProperty('id', productId);
});

test('should update a product', () => {
	const productId = 1;
	const updatedData = { name: 'Updated Product', price: 150 };
	const updatedProduct = productService.updateProduct(productId, updatedData);
	expect(updatedProduct.name).toBe(updatedData.name);
	expect(updatedProduct.price).toBe(updatedData.price);
});

test('should delete a product', () => {
	const productId = 1;
	const result = productService.deleteProduct(productId);
	expect(result).toBe(true);
});