import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

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
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockProduct]),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            create: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue(mockProduct),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = controller.healthCheck();
      expect(result).toEqual({ status: 'OK', service: 'product-service' });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockProduct]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        sku: 'TEST-SKU',
      };
      const result = await controller.create(createDto);
      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
      };
      const result = await controller.update(1, updateDto);
      expect(result).toEqual(mockProduct);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should soft-delete a product', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
