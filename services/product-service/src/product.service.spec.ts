import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    sku: 'TEST-SKU',
    stock: 10,
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue([mockProduct]),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            create: jest.fn().mockReturnValue(mockProduct),
            save: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of active products', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockProduct]);
      expect(repo.find).toHaveBeenCalledWith({ where: { isActive: true } });
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockProduct);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a new product', async () => {
      const createDto = { name: 'Test Product', price: 100, sku: 'TEST-SKU' };
      const result = await service.create(createDto);
      expect(result).toEqual(mockProduct);
      expect(repo.create).toHaveBeenCalledWith(createDto);
      expect(repo.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('update', () => {
    it('should update and save a product', async () => {
      const updateDto = { name: 'Updated Product' };
      const result = await service.update(1, updateDto);
      expect(result).toEqual(mockProduct); // Object.assign modifies mockProduct in place
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft-delete a product by setting isActive to false', async () => {
      // Need a fresh copy so we don't accidentally mutate the shared mockProduct across tests if run order changes
      const productToSoftDelete = { ...mockProduct, isActive: true };
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(productToSoftDelete as Product);

      const result = await service.remove(1);

      expect(result).toEqual({ deleted: true });
      expect(productToSoftDelete.isActive).toBe(false);
      expect(repo.save).toHaveBeenCalledWith(productToSoftDelete);
    });
  });
});
