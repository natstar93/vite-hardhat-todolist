import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers.js';
import { ethers, ignition } from 'hardhat';
import TodoListModule from '../ignition/modules/TodoList.ts';

describe('TodoList contract', function () {
  async function deployTodoListFixture() {
    const { todoList } = await ignition.deploy(TodoListModule);
    const [, listOwner] = await ethers.getSigners();

    return { todoList, listOwner };
  }

  describe('Deployment', function () {
    it('Should initialise with one task', async function () {
      const { todoList } = await loadFixture(deployTodoListFixture);
      const taskCount: bigint = await todoList.taskCount();
      expect(Number(taskCount)).equals(1);

      const initialTask = await todoList.tasks(1);
      expect(initialTask.content).to.equal('Eat chocolate');
    });

    it('Should contain a function to add a task', async function () {
      const taskName = 'Write unit tests';

      const { todoList } = await loadFixture(deployTodoListFixture);
      await todoList.createTask(taskName);
      const taskCount: bigint = await todoList.taskCount();
      expect(Number(taskCount)).equals(2);

      const newTask = await todoList.tasks(2);
      expect(newTask.content).to.equal(taskName);
    });
  });
});
