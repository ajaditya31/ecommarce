import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello from Catalog Service!'),
          },
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = controller.healthCheck();
      expect(result).toEqual({ status: 'OK', service: 'catalog-service' });
    });
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      const result = controller.getHello();
      expect(result).toBe('Hello from Catalog Service!');
      expect(service.getHello).toHaveBeenCalled();
    });
  });
});
