import { Test, TestingModule } from '@nestjs/testing';

import { MailModule } from './mail.module';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
      imports: [MailModule],
    }).compile();
    const app = module.createNestApplication();
    await app.init();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email', () => {
    service.sendEmail(
      'cyborgx999@gmail.com',
      'Hello',
      { name: 'sergey', url: 'ffs' },
      'confirmation',
    );
  });
});
