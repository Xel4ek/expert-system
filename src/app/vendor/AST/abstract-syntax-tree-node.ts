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
  QUERY = '?',
}

export abstract class AbstractSyntaxTreeNode {
  type: NodeType;

  constructor(type: NodeType) {
    this.type = type;
  }

  abstract resolve(): boolean | undefined | null;
}

export class AbstractSyntaxTreeLink extends AbstractSyntaxTreeNode {
  private readonly childNode:
    | AbstractSyntaxTreeAtom
    | AbstractSyntaxTreeConnector;

  constructor(
    parentNode: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector,
    childNode: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector
  ) {
    super('link');
    parentNode.link(this);
    this.childNode = childNode;
  }

  resolve(): boolean | undefined | null {
    // if (!this.childNode) {
    //   throw new Error('unlinked');
    // }
    return this.childNode.resolve();
  }

  // public link(
  //   parentNode: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector,
  //   childNode: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector
  // ): void {
  //   parentNode.link(this);
  //   this.childNode = childNode;
  // }
}

export class AbstractSyntaxTreeAtom extends AbstractSyntaxTreeNode {
  // факт

  protected links: AbstractSyntaxTreeLink[] = [];

  constructor() {
    super('fact');
  }

  resolve(): boolean | undefined | null {
    let result;
    for (const possibility of this.links) {
      const value = possibility.resolve();
      // false ? possibility : possibility.resolve();
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

  link(link: AbstractSyntaxTreeLink): void {
    this.links.push(link);
  }
}

export class AbstractSyntaxTreeConnector extends AbstractSyntaxTreeNode {
  // оператор
  links: AbstractSyntaxTreeLink[] = [];
  private operatorsResolve = new Map<
    Operators,
    () => boolean | undefined | null
  >([
    [
      Operators.NEGATION,
      () => {
        const [firstChild] = this.links;
        const result = firstChild.resolve();
        if (typeof result === 'boolean') {
          return !result;
        }
        return result;
      },
    ],
    [
      Operators.AND,
      () => {
        const [firstResult, secondResult] = this.links.map((child) =>
          child.resolve()
        );
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
      },
    ],
    [
      Operators.OR,
      () => {
        const [firstResult, secondResult] = this.links.map((child) =>
          child.resolve()
        );

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return firstResult || secondResult;
      },
    ],
    [
      Operators.XOR,
      () => {
        const [firstResult, secondResult] = this.links.map((child) =>
          child.resolve()
        );

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return !(firstResult && secondResult);
      },
    ],
    [
      Operators.EQUIVALENCE,
      () => {
        const [firstResult, secondResult] = this.links.map((child) =>
          child.resolve()
        );

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return (firstResult && secondResult) || (!firstResult && !secondResult);
      },
    ],
    /**
     * TODO
     * Сдесь помоему ошибка в возвращаемом резульатте (совпадает  с перрыдущем) для ложного не должно быть верно
     */
    [
      Operators.IMPLICATION,
      () => {
        const [firstResult, secondResult] = this.links.map((child) =>
          child.resolve()
        );

        if (firstResult === null || secondResult === null) {
          return null;
        }
        if (firstResult === undefined || secondResult === undefined) {
          return undefined;
        }
        return (firstResult && secondResult) || (!firstResult && !secondResult);
      },
    ],
  ]);
  private linkGenerator = new Map<
    Operators,
    (
      rhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector,
      lhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector
    ) => void
  >([
    [
      Operators.AND,
      (rhs, lhs) => {
        const firstLink = new AbstractSyntaxTreeLink(this, lhs);
        const secondLink = new AbstractSyntaxTreeLink(this, rhs);
      },
    ],
    // [Operators.NEGATION, (rhs, lhs) =>  {}],
    // [Operators.OR, (rhs, lhs) =>  {}],
    // [Operators.XOR, (rhs, lhs) =>  {}],
    // [Operators.EQUIVALENCE, (rhs, lhs) =>  {}],
    // [Operators.IMPLICATION, (rhs, lhs) =>  {}],
  ]);

  // private readonly firstChild: AbstractSyntaxTreeLink, // private readonly secondChild?: AbstractSyntaxTreeLink

  constructor(
    private readonly operand: Operators,
    rhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector,
    lhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector
  ) {
    super('operand');
    const generator = this.linkGenerator.get(operand);
    if (generator) {
      generator(rhs, lhs);
    }
  }
  link(link: AbstractSyntaxTreeLink): void {
    console.warn('trifered ', this);
    this.links.push(link);
  }

  resolve(): boolean | undefined | null {
    const resolver = this.operatorsResolve.get(this.operand);
    if (!resolver) {
      throw new Error('Unknown operator');
    }
    return resolver();
  }
}
