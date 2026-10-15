import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
    try {
        const product = req.body || {};
        const requiredFields = ['id', 'title', 'description', 'category', 'price', 'stock', 'sku', 'thumbnail'];
        const missingFields = requiredFields.filter((field) => {
            const value = product[field];
            return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required product fields',
                missingFields,
            });
        }

        const productDocument = new Product(product);
        await productDocument.validate();
        
        const existingProduct = await Product.findOne({ id: product.id });
        if (existingProduct) {
            return res.status(409).json({ success: false, message: 'Product already exists' });
        }

        const createdProduct = await productDocument.save();

        return res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: createdProduct,
        });

    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product details',
                errors: Object.values(err.errors || {}).map((error) => error.message),
            });
        }

        return res.status(500).json({ success: false, message: 'Unable to add Product' });
    }
}

// Adding multiple products at once - Future Feature
// export const createProducts = async (req, res) => {
    
// }

// UNIFIED: Handles All Products, Search Query, and Category Filter
export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        const products = await Product.find(query);

        return res.status(200).json({
            success: true,
            count: products.length,
            message: 'Products returned successfully',
            products: products,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Unable to get products' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const oid = req.params.id;
        
        if (!oid || oid === "" || typeof oid !== "string") {
            return res.status(400).json({ success: false, message: 'Invalid id' });
        }
        
        const id = Number(oid);
        if (!id || id <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid id' });
        }

        const product = await Product.findOne({ id: id });
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Product found successfully',
            product: product,
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Unable to find Product' });
    }
};

// Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        
        return res.status(200).json({
            success: true,
            message: 'Categories returned successfully',
            categories: categories,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Unable to get categories' });
    }
};