import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Digital Art NFT",
    description: "Beautiful digital artwork perfect for your collection",
    price: 0.5,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    category: "Digital Art",
    inStock: true,
  },
  {
    id: "2",
    name: "Premium Membership",
    description: "Get access to exclusive features and content",
    price: 1.2,
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=400&fit=crop",
    category: "Membership",
    inStock: true,
  },
  {
    id: "3",
    name: "Crypto Course Bundle",
    description: "Complete learning bundle for blockchain development",
    price: 2.5,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
    category: "Education",
    inStock: true,
  },
  {
    id: "4",
    name: "Virtual Land Plot",
    description: "Own a piece of virtual real estate in the metaverse",
    price: 5.0,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    category: "Virtual Assets",
    inStock: true,
  },
  {
    id: "5",
    name: "Game Character Skin",
    description: "Rare character skin for your gaming avatar",
    price: 0.8,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
    category: "Gaming",
    inStock: true,
  },
  {
    id: "6",
    name: "Music Track License",
    description: "License to use this exclusive music track commercially",
    price: 1.5,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    category: "Music",
    inStock: true,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

