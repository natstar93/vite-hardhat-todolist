import request from 'supertest';
import app from './app.ts';

describe('App endpoints', () => {
  it('should serve healthcheck page', async () => {
    const res = await request(app).get('/healthcheck');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toEqual("I'm healthy");
  });
});
