import { ProductRepository } from "../repositories/ProductRepository";
import { Product } from "../entities/Product";

export class ProductService {
    private productRepository = new ProductRepository();

    async findAll(): Promise<Product[]> {
        return this.productRepository.findAll();
    }
}