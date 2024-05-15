import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { IgnitionModule, NamedArtifactContractDeploymentFuture } from '@nomicfoundation/ignition-core';

const TodoListModule: IgnitionModule<"TodoListModule", string, {
  todoList: NamedArtifactContractDeploymentFuture<"TodoList">;
}> = buildModule(
  'TodoListModule',
  (module) => {
    const todoList = module.contract('TodoList');
    return { todoList };
  }
);

export default TodoListModule;
