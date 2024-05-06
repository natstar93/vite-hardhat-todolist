import ViteExpress from 'vite-express';
import type { Request, Response } from 'express';
import server from './server.ts';
import app from './app.ts';

jest.mock('vite-express', () => ({
  listen: jest.fn(),
}));
jest.mock('./app.ts', jest.fn);

describe('Server', () => {
  test('should listen on port 3000', async () => {
    const listenMock = ViteExpress.listen as jest.Mock;
    const req = {} as Request;
    const res = {} as Response;
    server(req, res);
    expect(listenMock).toHaveBeenCalledWith(app, 3000, expect.any(Function));
  });
});
