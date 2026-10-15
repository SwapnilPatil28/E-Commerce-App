import express from 'express';
import {
	createProduct,
    getProducts,
    getProductById,
    getCategories,
} from '../controllers/product.controller.js';

const router = express.Router();

router.post('/create', createProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/categories', getCategories);


export default router;
