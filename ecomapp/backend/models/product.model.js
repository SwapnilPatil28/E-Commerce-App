import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true, lowercase: true },
        price: { type: Number, required: true, min: 0.01 },
        discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        stock: { type: Number, required: true, default: 0, min: 0 },
        tags: [{ type: String, trim: true, lowercase: true }],
        brand: { type: String, trim: true },
        sku: { type: String, required: true, unique: true, trim: true },
        weight: { type: Number, min: 0 },
        dimensions: {
            width: { type: Number, min: 0 },
            height: { type: Number, min: 0 },
            depth: { type: Number, min: 0 }
        },
        warrantyInformation: { type: String, trim: true },
        shippingInformation: { type: String, trim: true },
        availabilityStatus: { type: String, trim: true },
        reviews: [
            {
                rating: { type: Number, required: true, min: 1, max: 5 },
                comment: { type: String, trim: true },
                date: { type: Date },
                reviewerName: { type: String, trim: true },
                reviewerEmail: { type: String, lowercase: true, trim: true }
            }
        ],
        returnPolicy: { type: String, trim: true },
        minimumOrderQuantity: { type: Number, default: 1, min: 1 },
        meta: {
            createdAt: { type: Date },
            updatedAt: { type: Date },
            barcode: { type: String, trim: true },
            qrCode: { type: String, trim: true }
        },
        images: [{ type: String, trim: true }],
        thumbnail: { type: String, required: true, trim: true }
    },
    // This automatically adds top-level createdAt and updatedAt fields
    { timestamps: true } 
);

export default mongoose.model('Product', productSchema);
