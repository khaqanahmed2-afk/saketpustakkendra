import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [imgSrc, setImgSrc] = useState(product.image);
    const [hasError, setHasError] = useState(false);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(`Hello, I want to know the price for ${product.name}`);
        const phoneNumber = "917754057200";
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    const handleImageError = () => {
        if (!hasError) {
            setImgSrc("https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80");
            setHasError(true);
        }
    };

    return (
        <Card
            onClick={handleWhatsAppClick}
            className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden h-full flex flex-col bg-white rounded-[1.5rem] hover:-translate-y-1 cursor-pointer"
        >
            <div className="aspect-square relative overflow-hidden bg-slate-50 p-6 flex items-center justify-center">
                <img
                    src={imgSrc}
                    alt={product.name}
                    onError={handleImageError}
                    loading="lazy"
                    className={`object-contain w-full h-full drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ${hasError ? 'opacity-80 grayscale' : ''}`}
                />
            </div>
            <CardContent className="p-5 flex-grow text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                    {product.category}
                </p>
                <h3 className="font-bold text-slate-800 line-clamp-2 leading-snug text-sm min-h-[2.5rem]">
                    {product.name}
                </h3>
                <div className="mt-3 flex items-center justify-center gap-1">
                    <span className="text-xs text-amber-500">★★★★★</span>
                    <span className="text-[10px] text-slate-300">(12 reviews)</span>
                </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 mt-auto">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppClick();
                    }}
                    className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-full text-xs h-10 shadow-md shadow-orange-200"
                >
                    <MessageCircle className="w-3 h-3 mr-2" />
                    Check Price
                </Button>
            </CardFooter>
        </Card>
    );
}
