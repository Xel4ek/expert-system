import {
  ASTOperandNodeInterface,
  ASTTokenNodeInterface,
} from './astnode.interface';

export abstract class ASTNode<T> {
  abstract resolve(): T;
}

export class ASTOperandNode<T> extends ASTNode<T> {
  leftChild: ASTNode<T>;
  name: string;
  rightChild: ASTNode<T>;
  type: 'operand' = 'operand';
  constructor(
    name: string,
    leftChild: ASTNode<T>,
    rightChild: ASTNode<T>,
    operand: (left: ASTNode<T>, right: ASTNode<T>) => T
  ) {
    super();
    this.name = name;
    this.operand = operand;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
  operand: (left: ASTNode<T>, right: ASTNode<T>) => T;

  resolve(): T {
    return this.operand(this.leftChild, this.rightChild);
  }
}

export class ASTTokenNode<T> extends ASTNode<T> {
  name: string;
  type: 'fact' = 'fact';
  value: T;
  private alternative: ASTNode<T>[] = [];
  constructor(name: string, value: T) {
    super();
    this.name = name;
    this.value = value;
  }
  set(node: ASTNode<T> | T): void {
    if (node instanceof ASTNode) {
      this.alternative.push(node);
    } else {
      this.value = node;
    }
  }
  resolve(): T {
    return (
      this.alternative.find((node) => !!node.resolve())?.resolve() || this.value
    );
  }
}
