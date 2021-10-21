import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from '../resource/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET', () => {
    it('/api', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect('Hello World!');
    });

    it('/api/command', () => {
      return request(app.getHttpServer())
        .get('/api/command')
        .expect(200)
        .expect({
          some: 'useful',
          data: 'which',
          we: 'need',
          something: 'that',
          I: 'need',
          To: 'Find',
        });
    });

    it('/api/throw', () => {
      return request(app.getHttpServer()).get('/api/throw').expect(200);
    });

    xit('/api/passthru', () => {
      return request(app.getHttpServer())
        .get('/api/passthru')
        .expect(200)
        .expect('Hello World!');
    });
  });
});
