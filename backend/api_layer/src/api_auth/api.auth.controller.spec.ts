import { Test, TestingModule } from '@nestjs/testing';
import { ApiAuthController } from './api.auth.controller';

describe('ApiAuthController', () => {
  let controller: ApiAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiAuthController],
    }).compile();

    controller = module.get<ApiAuthController>(ApiAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
