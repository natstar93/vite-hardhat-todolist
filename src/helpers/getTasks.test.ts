import { Contract } from 'ethers';
import getTasks from './getTasks.ts';
import { formatErrorMessage } from './formatErrorMessage.ts';

jest.mock('./formatErrorMessage', () => ({
  formatErrorMessage: jest.fn(),
}));

describe('getTasks', () => {
  const mockContract = {
    taskCount: jest.fn(),
    tasks: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully retrieves tasks', async () => {
    const mockTasks = [
      { id: 1, content: 'Task 1', completed: false },
      { id: 2, content: 'Task 2', completed: true },
    ];
    mockContract.taskCount.mockResolvedValueOnce(2);
    mockContract.tasks.mockResolvedValueOnce(mockTasks[0]);
    mockContract.tasks.mockResolvedValueOnce(mockTasks[1]);

    const result = await getTasks(mockContract as unknown as Contract);

    expect(result).toEqual({ taskList: mockTasks, error: '' });
    expect(mockContract.taskCount).toHaveBeenCalled();
    expect(mockContract.tasks).toHaveBeenCalledTimes(2);

    expect(formatErrorMessage).not.toHaveBeenCalled();
  });

  it('handles error when retrieving tasks', async () => {
    const mockError = new Error('Mock error');
    const formattedError = 'Formatted error';
    (formatErrorMessage as jest.Mock).mockReturnValueOnce(formattedError);
    mockContract.taskCount.mockRejectedValueOnce(mockError);

    const result = await getTasks(mockContract as unknown as Contract);

    expect(result).toEqual({ taskList: [], error: formattedError });
    expect(mockContract.taskCount).toHaveBeenCalled();
    expect(mockContract.tasks).not.toHaveBeenCalled();
    expect(formatErrorMessage).toHaveBeenCalledWith(mockError);
  });
});
