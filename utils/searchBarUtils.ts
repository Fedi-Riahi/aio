
import apiClient from "./apiClient";
import { Category, CategoryItem } from "../types/searchBar";

export const placeholders = [
  "Vous cherchez des festivals de musique près de chez vous ?",
  "Quelles sont les meilleures conférences tech ce mois-ci ?",
  "Y a-t-il des expositions d'art en ville ?",
  "Trouvez des dégustations culinaires locales ce week-end.",
  "Recherchez les prochains matchs sportifs dans votre région.",
];

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/normalaccount/getcategories");
    const data = response.data;
    return Array.isArray(data.respond?.data)
      ? data.respond.data.map((cat: any) => ({
          id: cat._id,
          name: cat.name,
        }))
      : [];
  } catch (err) {
    console.error("Failed to fetch categories:", err.response?.status || err.message);
    return [];
  }
};

export const buildCategoryNames = (categories: Category[]): Omit<CategoryItem, "icon">[] => {
  return [
    { name: "All", href: "", id: "" },
    ...categories.map((category) => ({
      name: category.name,
      href: category.name,
      id: category.id,
    })),
  ];
};

export interface Category {
  id: string;
  name: string;
}
