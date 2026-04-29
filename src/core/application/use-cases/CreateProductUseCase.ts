import { ProductRepository, ProductEntity } from '../../domain/repositories/ProductRepository';

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(data: Omit<ProductEntity, 'id'>): Promise<ProductEntity> {
    if (data.price < 0) throw new Error("Le prix ne peut pas être négatif");
    if (data.quantity < 0) throw new Error("La quantité ne peut pas être négative");
    if (data.images.length === 0 || data.images.length > 4) {
      throw new Error("Le produit doit avoir entre 1 et 4 images");
    }

    return this.productRepository.create(data);
  }
}
