import request from 'supertest';
import { app } from '../app';

describe('Dead Infrastructure Mapper REST API Integration', () => {
  it('GET /api/health returns health status', async () => {
    const res = await request(app).get('/api/health');
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('service', 'dead-infrastructure-mapper-api');
    expect(res.body).toHaveProperty('status');
  });

  it('GET /health returns health status for legacy monitoring', async () => {
    const res = await request(app).get('/health');
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('service', 'dead-infrastructure-mapper-api');
  });

  it('POST /api/ai/analyze-report validates input and returns structured analysis', async () => {
    const res = await request(app)
      .post('/api/ai/analyze-report')
      .send({
        description: 'Streetlight pole is bent and unlit near school gate',
        infrastructureType: 'STREETLIGHT',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('issueCategory');
    expect(res.body.data).toHaveProperty('severity');
    expect(res.body.data).toHaveProperty('summary');
  });

  it('POST /api/ai/classify-issue rejects invalid short descriptions with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/ai/classify-issue')
      .send({
        description: 'bad',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/infrastructure rejects invalid coordinates with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/infrastructure')
      .send({
        name: 'Invalid Asset',
        type: 'STREETLIGHT',
        latitude: 999, // invalid latitude > 90
        longitude: 77.5,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /unknown-endpoint returns 404 JSON', async () => {
    const res = await request(app).get('/api/non-existent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
