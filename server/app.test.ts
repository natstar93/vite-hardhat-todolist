import request from 'supertest';
import * as getTodoListData from './handlers/getTodoListData.ts';
import app from './app.ts';

jest.mock('./handlers/getTodoListData.ts', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('App endpoints', () => {
  describe('should serve api/wallet route', () => {
    test('when getTodoListData returns data', async () => {
      const getTodoListDataSpy = jest
        .spyOn(getTodoListData, 'default')
        .mockResolvedValue({ taskList: [], taskCount: 0 });
      const res = await request(app).get('/api/wallet');
      expect(getTodoListDataSpy).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('json');
      expect(res.body).toEqual({ taskCount: 0, taskList: [] });
    });

    test('when getTodoListData throws an error', async () => {
      const getTodoListDataSpy = jest
        .spyOn(getTodoListData, 'default')
        .mockRejectedValue(new Error('Boom'));

      const res = await request(app).get('/api/wallet');
      expect(getTodoListDataSpy).toHaveBeenCalled();
      expect(res.status).toBe(500);
    });
  });

  test('should serve healthcheck page', async () => {
    const res = await request(app).get('/healthcheck');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toEqual("I'm healthy");
  });
});
