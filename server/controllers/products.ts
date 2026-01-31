import { Request, Response } from "express";
import { db } from "../db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "server", "uploads", "products");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

// GET /api/products - List all products
export async function getProducts(req: Request, res: Response) {
    try {
        const allProducts = await db.select().from(products).orderBy(products.createdAt);
        res.json(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}

// POST /api/products - Create new product
export async function createProduct(req: Request, res: Response) {
    try {
        const { name, category, description, imageUrl } = req.body;

        if (!name || !category) {
            return res.status(400).json({ error: "Name and category are required" });
        }

        const [newProduct] = await db.insert(products).values({
            name,
            category,
            description: description || null,
            imageUrl: imageUrl || null,
            source: "admin"
        }).returning();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
}

// DELETE /api/products/:id - Delete product
export async function deleteProduct(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Get product to delete image file
        const [product] = await db.select().from(products).where(eq(products.id, id));

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete image file if exists
        if (product.imageUrl) {
            const imagePath = path.join(process.cwd(), "server", product.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete from database
        await db.delete(products).where(eq(products.id, id));

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
}

// POST /api/products/upload-image - Upload product image
export async function uploadImage(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Return the relative path to store in database
        const imageUrl = `/uploads/products/${req.file.filename}`;

        res.json({
            imageUrl,
            message: "Image uploaded successfully"
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Failed to upload image" });
    }
}
