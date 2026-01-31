import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShinyButton } from "@/components/ui/shiny-button";
import { ImagePlus, Check, Loader2, X, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function AddProduct() {
    const [, setLocation] = useLocation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [name, setName] = useState("");
    const [category, setCategory] = useState("School Essentials");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        setImageFile(file);
        setError("");

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Upload image to server
    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;

        setIsUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await fetch("/api/products/upload-image", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to upload image");
            }

            const data = await response.json();
            return data.imageUrl;
        } catch (err: any) {
            setError(err.message || "Failed to upload image");
            return null;
        } finally {
            setIsUploadingImage(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate required fields
        if (!name.trim()) {
            setError("Product name is required");
            return;
        }

        if (!category) {
            setError("Category is required");
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload image first if selected
            let finalImageUrl = imageUrl;
            if (imageFile && !imageUrl) {
                const uploadedUrl = await uploadImage();
                if (!uploadedUrl) {
                    setIsSubmitting(false);
                    return; // Error already set by uploadImage
                }
                finalImageUrl = uploadedUrl;
            }

            // Create product
            const response = await fetch("/api/products", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    category,
                    description: description.trim() || null,
                    price: price ? parseFloat(price) : 0,
                    imageUrl: finalImageUrl || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create product");
            }

            // Success!
            setSuccess(true);

            // Reset form
            setTimeout(() => {
                setName("");
                setCategory("School Essentials");
                setDescription("");
                setPrice("");
                setImageUrl("");
                setImageFile(null);
                setImagePreview("");
                setSuccess(false);

                // Navigate to product management
                setLocation("/admin/products");
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
        setImageUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-secondary/30 pb-20">
                <div className="bg-gradient-to-r from-primary/10 via-secondary to-accent/10 pt-12 pb-20 px-4 border-b border-primary/5">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-display font-bold mb-4 text-slate-800">Add New Product</h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Add new inventory to your shop. Ensure images are clear and descriptions are catchy.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 -mt-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="border-primary/10 shadow-lg bg-white rounded-[2rem] overflow-hidden">
                            <CardHeader className="px-8 pt-8 pb-0">
                                <CardTitle className="text-xl font-bold text-slate-800">Product Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    )}

                                    {/* Success Message */}
                                    {success && (
                                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm">Product created successfully! Redirecting...</p>
                                        </div>
                                    )}

                                    {/* Image Upload */}
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />

                                        {imagePreview ? (
                                            <div className="relative border-2 border-primary/20 rounded-3xl overflow-hidden bg-slate-50">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-64 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-600 rounded-full p-2 shadow-lg transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-primary/20 rounded-3xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm text-primary mb-4 group-hover:scale-110 transition-transform">
                                                    {isUploadingImage ? (
                                                        <Loader2 className="w-8 h-8 animate-spin" />
                                                    ) : (
                                                        <ImagePlus className="w-8 h-8" />
                                                    )}
                                                </div>
                                                <p className="text-slate-700 font-bold mb-1">Click to upload product image</p>
                                                <p className="text-slate-400 text-sm">or drag and drop high-res PNG/JPG (max 5MB)</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1">
                                                Product Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Classmate Notebook"
                                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1">Price (₹)</Label>
                                            <Input
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1">
                                            Category <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option>School Essentials</option>
                                            <option>Office Stationery</option>
                                            <option>Art & Craft</option>
                                            <option>Exam Books</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1">Description</Label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Describe the product features..."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <ShinyButton
                                            type="submit"
                                            disabled={isSubmitting || success}
                                            className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    Creating Product...
                                                </>
                                            ) : success ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Product Created!
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5 mr-2" />
                                                    Publish Product
                                                </>
                                            )}
                                        </ShinyButton>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
