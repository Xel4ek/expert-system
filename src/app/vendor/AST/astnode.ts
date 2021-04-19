import {
  ASTOperandNodeInterface,
  ASTTokenNodeInterface,
} from './astnode.interface';

export abstract class ASTNode {}

export class ASTOperandNode<T>
  extends ASTNode
  implements ASTOperandNodeInterface<T> {
  leftChild: ASTNode;
  name: string;
  rightChild: ASTNode;
  type: 'operand' = 'operand';
  constructor(
    name: string,
    leftChild: ASTNode,
    rightChild: ASTNode,
    operand: T
  ) {
    super();
    this.name = name;
    this.operand = operand;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
  operand: T;
}

export class ASTTokenNode<T>
  extends ASTNode
  implements ASTTokenNodeInterface<T> {
  name: string;
  type: 'fact' = 'fact';
  value: T;
  constructor(name: string, value: T) {
    super();
    this.name = name;
    this.value = value;
  }
}
