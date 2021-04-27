export type NodeType = 'link' | 'operand' | 'fact';

export enum Operators {
  NEGATION = '!',
  AND = '+',
  OR = '|',
  XOR = '^',
  EQUIVALENCE = '⇔',
  IMPLICATION = '→',
}

export enum Controls {
  EQUAL = '=',
  QUERY = '?'
}

export abstract class AbstractSyntaxTreeNode {

  constructor(
    type: NodeType
  ) {
    this.type = type;
  }

  type: NodeType;

  protected links: AbstractSyntaxTreeLink[] = [];

  abstract resolve(): boolean | undefined | null;

  protected abstract setValue(value: boolean): void;

  link(link: AbstractSyntaxTreeLink): void {
    this.links.push(link);
  }
}

export class AbstractSyntaxTreeLink extends AbstractSyntaxTreeNode {
  // private parentNode?: AbstractSyntaxTreeConnector;
  private childNode?: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector;

  constructor(
    // private readonly parentNode: AbstractSyntaxTreeConnector,
    // private readonly childNode: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector
  ) {
    super('link');
  }

  resolve(): boolean | undefined | null {
    if (!this.childNode) {
      throw new Error('unlinked');
    }
    return this.childNode.resolve();
  }

  protected setValue(value: boolean): void {
    throw new Error('can not set value ' + value + 'in AbstractSyntaxTreeLink class');
  }

  public link(parentNode: AbstractSyntaxTreeConnector, childNode: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector): void {
    parentNode.link(this);
    this.childNode = childNode;
  }
}

export class AbstractSyntaxTreeAtom extends AbstractSyntaxTreeNode {  // факт
  private possibilities: (boolean | AbstractSyntaxTreeLink)[] = [];

  constructor() {
    super('fact');
  }

  resolve(): boolean | undefined | null {
    let result;
    for (const possibility of this.possibilities) {
      const value = typeof possibility === 'boolean' ? possibility : possibility.resolve();
      if (value === undefined || value === null) {
        continue;
      }
      if (result === undefined) {
        result = value;
      }
      if (result !== value) {
        throw new Error('logical error in ' + possibility);
      }
    }
    return result;
  }

  protected setValue(value: boolean | AbstractSyntaxTreeLink): void {
    this.possibilities.push(value);
  }

}

export class AbstractSyntaxTreeConnector extends AbstractSyntaxTreeNode { // оператор
  constructor(
    private readonly operand: Operators,
    private readonly firstChild: AbstractSyntaxTreeLink,
    private readonly secondChild?: AbstractSyntaxTreeLink
  ) {
    super('operand');
  }

  private operatorsResolve = new Map<Operators, () => boolean | undefined | null>([
      [Operators.NEGATION, () => {
        const result = this.firstChild.resolve();
        if (typeof result === 'boolean') {
          return !result;
        }
        return result;
      }],
      [Operators.AND, () => {
        const firstResult = this.firstChild.resolve();
        const secondResult = this.secondChild?.resolve();

        if (firstResult && secondResult) {
          return true;
        }
        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return false;
      }],
      [Operators.OR, () => {
        const firstResult = this.firstChild.resolve();
        const secondResult = this.secondChild?.resolve();

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return firstResult || secondResult;
      }],
      [Operators.XOR, () => {
        const firstResult = this.firstChild.resolve();
        const secondResult = this.secondChild?.resolve();

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return !(firstResult && secondResult);
      }],
      [Operators.EQUIVALENCE, () => {
        const firstResult = this.firstChild.resolve();
        const secondResult = this.secondChild?.resolve();

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return (firstResult && secondResult) || (!firstResult && !secondResult);
      }],
      [Operators.IMPLICATION, () => {
        const firstResult = this.firstChild.resolve();
        const secondResult = this.secondChild?.resolve();

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return (firstResult && secondResult) || (!firstResult && !secondResult);
      }]
    ]
  );

  // private connectorGenerator = new Map<Operators, (rhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector, lhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector) => AbstractSyntaxTreeConnector>([
  //     [Operators.OR, (rhs, lhs) => {
  //
  //     }],
  //   ]
  // );

  resolve():
    boolean | undefined | null {
    const resolver = this.operatorsResolve.get(this.operand);
    if (!resolver) {
      throw new Error('unknown operator');
    }
    return resolver();
  }

  protected setValue(value: boolean): void {
    throw new Error('can not set value by AbstractSyntaxTreeConnector class');
  }
}

