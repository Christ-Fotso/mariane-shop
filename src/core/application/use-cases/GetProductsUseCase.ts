import { ProductRepository, ProductEntity } from '../../domain/repositories/ProductRepository';

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<ProductEntity[]> {
    return this.productRepository.findAll();
  }
}
