import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { PackagePlus, Trash2, Upload, ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
    id: string;
    name: string;
    category: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
};

const CATEGORIES = [
    "School Essentials",
    "Stationery",
    "Competitive Books",
    "Kids Education",
];

export default function ProductManagement() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Form state
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // Fetch products (MUST be before conditional returns)
    const { data: products = [], isLoading } = useQuery<Product[]>({
        queryKey: ["/api/products"],
    });

    // Upload image mutation
    const uploadImageMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/products/upload-image", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Image upload failed");
            }

            return res.json();
        },
        onSuccess: (data) => {
            setUploadedImageUrl(data.imageUrl);
            toast({
                title: "Image uploaded",
                description: "Product image uploaded successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Upload failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Create product mutation
    const createMutation = useMutation({
        mutationFn: async (productData: {
            name: string;
            category: string;
            description?: string;
            imageUrl?: string;
        }) => {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create product");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            toast({
                title: "Product added",
                description: "Product has been added successfully",
            });
            clearForm();
        },
        onError: (error: Error) => {
            toast({
                title: "Failed to add product",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Delete product mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to delete product");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            toast({
                title: "Product deleted",
                description: "Product has been removed successfully",
            });
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        },
        onError: (error: Error) => {
            toast({
                title: "Failed to delete product",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Auth check - AFTER all hooks
    if (loading) return null;
    if (!user || user.role !== "admin") {
        return <Redirect to="/login" />;
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadImage = () => {
        if (imageFile) {
            uploadImageMutation.mutate(imageFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !category) {
            toast({
                title: "Validation error",
                description: "Name and category are required",
                variant: "destructive",
            });
            return;
        }

        createMutation.mutate({
            name,
            category,
            description: description || undefined,
            imageUrl: uploadedImageUrl || undefined,
        });
    };

    const clearForm = () => {
        setName("");
        setCategory("");
        setDescription("");
        setImageFile(null);
        setImagePreview("");
        setUploadedImageUrl("");
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            deleteMutation.mutate(productToDelete.id);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-secondary/30 pb-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 pt-12 pb-20 px-4 border-b border-primary/5">
                    <div className="container mx-auto max-w-7xl text-center">
                        <h1 className="text-4xl font-display font-bold mb-4 text-slate-800">
                            Product Management
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Add, manage, and organize your shop products
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Add Product Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-primary/10 bg-white rounded-[2rem] shadow-lg">
                                <CardHeader className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <PackagePlus className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-2xl text-slate-800">
                                            Add New Product
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Product Name */}
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-semibold">
                                                Product Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Natraj Pencil – Pack of 10"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="mt-2"
                                                required
                                            />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <Label htmlFor="category" className="text-sm font-semibold">
                                                Category *
                                            </Label>
                                            <Select value={category} onValueChange={setCategory} required>
                                                <SelectTrigger className="mt-2">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <Label htmlFor="description" className="text-sm font-semibold">
                                                Description (Optional)
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Short details about the product"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="mt-2"
                                                rows={3}
                                            />
                                        </div>

                                        {/* Image Upload */}
                                        <div>
                                            <Label className="text-sm font-semibold">
                                                Product Image (Optional)
                                            </Label>
                                            <div className="mt-2 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        onChange={handleImageSelect}
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={handleUploadImage}
                                                        disabled={!imageFile || uploadImageMutation.isPending}
                                                        className="bg-blue-500 hover:bg-blue-600"
                                                    >
                                                        {uploadImageMutation.isPending ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Upload className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>

                                                {imagePreview && (
                                                    <div className="relative w-32 h-32 border-2 border-dashed border-primary/20 rounded-xl overflow-hidden">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {uploadedImageUrl && (
                                                    <div className="text-sm text-green-600 flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4" />
                                                        Image uploaded successfully
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="submit"
                                                disabled={createMutation.isPending}
                                                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-12"
                                            >
                                                {createMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : null}
                                                Save Product
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={clearForm}
                                                className="px-8 rounded-xl h-12"
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Product List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="border-primary/10 bg-white rounded-[2rem] shadow-lg">
                                <CardHeader className="p-8">
                                    <CardTitle className="text-2xl text-slate-800">
                                        All Products ({products.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    {isLoading ? (
                                        <div className="text-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="text-center py-12 text-slate-400">
                                            <PackagePlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No products yet. Add your first product!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                            {products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-all"
                                                >
                                                    {/* Product Image */}
                                                    <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {product.imageUrl ? (
                                                            <img
                                                                src={product.imageUrl}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="w-8 h-8 text-slate-300" />
                                                        )}
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-slate-800 truncate">
                                                            {product.name}
                                                        </h4>
                                                        <span className="inline-block mt-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    {/* Delete Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="text-red-500 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{productToDelete?.name}"? This
                                action cannot be undone and the product will be removed from the
                                shop.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                {deleteMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                Yes, Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
}
