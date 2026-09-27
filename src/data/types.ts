export type ProductCategory =
  | "shorts"
  | "tshirts"
  | "hoodies"
  | "outerwear"
  | "rashguards"
  | "tights";

export type ProductTag = "training" | "combat" | "everyday" | "new";

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
}

export interface ProductSize {
  id: string;
  label: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  tags: ProductTag[];
  price: number;
  oldPrice?: number;
  isNew: boolean;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: string[];
  description: string;
  recommendedSize?: string;
  collection: string;
  season: "Осень-Зима" | "Весна-Лето" | "Всесезон";
  material: string;
  createdAt: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
}
