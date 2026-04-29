export interface ProductEntity {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  images: string[];
  brandId: string | null;
  categoryId: string | null;
}

export interface ProductRepository {
  findAll(): Promise<ProductEntity[]>;
  findById(id: string): Promise<ProductEntity | null>;
  create(data: Omit<ProductEntity, 'id'>): Promise<ProductEntity>;
  update(id: string, data: Partial<Omit<ProductEntity, 'id'>>): Promise<ProductEntity>;
  delete(id: string): Promise<void>;
}
