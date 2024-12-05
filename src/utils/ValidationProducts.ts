import { ProductsI } from "../models/ProductModel";

interface ValidationError {
  field: string;
  message: string;
}

export const validateProductData = (data: Partial<ProductsI>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.length === 0) {
    errors.push({ field: "name", message: "Please provide a name" });
  }
  if (!data.price) {
    errors.push({ field: "price", message: "Please provide a price" });
  }
  if (!data.description || data.description.length === 0) {
    errors.push({ field: "description", message: "Please provide a description" });
  }
  if (!data.category) {
    errors.push({ field: "category", message: "Please provide a category" });
  }
  if (!data.company) {
    errors.push({ field: "company", message: "Please provide a company name" });
  }
  if (!data.colors || data.colors.length === 0) {
    errors.push({ field: "colors", message: "Please provide at least one color" });
  }
  if (!data.user_id) {
    errors.push({ field: "user_id", message: "User ID is required" });
  }

  return errors;
};
