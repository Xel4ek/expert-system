export interface ASTNodeInterface {
  name?: string;
  type?: 'fact' | 'operand';
}

export interface ASTOperandNodeInterface<T> extends ASTNodeInterface {
  leftChild?: ASTNodeInterface;
  rightChild?: ASTNodeInterface;
  operand: T;
}

export interface ASTTokenNodeInterface<T> extends ASTNodeInterface {
  value: T;
}
