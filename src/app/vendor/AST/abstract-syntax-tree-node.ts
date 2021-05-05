import { Token, Tokens } from '@vendor/lexer/token';

export type NodeType = 'link' | 'operand' | 'fact';

export enum Operators {
  NEGATION = '!',
  AND = '+',
  OR = '|',
  XOR = '^',

  // EMPTY = '∅',
}

export enum Controls {
  EQUIVALENCE = '⇔',
  IMPLICATION = '→',
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
  value: Operators | string;
  protected links: AbstractSyntaxTreeLink[] = [];
  private result = false;
  constructor(token: Token) {
    super('fact');
    this.value = token.value;
  }

  resolve(): boolean | undefined | null {
    for (const possibility of this.links) {
      const value = possibility.resolve();
      // false ? possibility : possibility.resolve();
      if (value === undefined || value === null) {
        continue;
      }
      if (value) {
        this.result = value;
        return this.result;
      }
    }
    return this.result;
  }

  link(link: AbstractSyntaxTreeLink): void {
    this.links.push(link);
  }
  setValue(value = true): void {
    this.result = value;
  }
  //TODO если значение на атом ноде то setVаlue в базовый класс
  //уникальный тип ссылкы который возвращает true / false
  //для коннектора  и атом ноды
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
    // [
    //   Operators.EQUIVALENCE,
    //   () => {
    //     const [firstResult, secondResult] = this.links.map((child) =>
    //       child.resolve()
    //     );
    //
    //     if (firstResult === null || secondResult === null) {
    //       return null;
    //     }
    //     if (firstResult === undefined || secondResult === undefined) {
    //       return undefined;
    //     }
    //     return (firstResult && secondResult) || (!firstResult && !secondResult);
    //   },
    // ],
    // /**
    //  * TODO
    //  * Сдесь помоему ошибка в возвращаемом резульатте (совпадает  с перрыдущем) для ложного не должно быть верно
    //  */
    // [
    //   Operators.IMPLICATION,
    //   () => {
    //     const [firstResult, secondResult] = this.links.map((child) =>
    //       child.resolve()
    //     );
    //
    //     if (firstResult === null || secondResult === null) {
    //       return null;
    //     }
    //     if (firstResult === undefined || secondResult === undefined) {
    //       return undefined;
    //     }
    //     return (firstResult && secondResult) || (!firstResult && !secondResult);
    //   },
    // ],ссылки между правым и левым  TODO
  ]);
  private linkGenerator = new Map<
    Operators | Controls,
    (
      rhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector,
      lhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector
    ) => void
  >([
    [
      Operators.AND,
      (rhs, lhs) =>
        new AbstractSyntaxTreeLink(this, lhs) &&
        new AbstractSyntaxTreeLink(this, rhs),
    ],
    [Operators.NEGATION, (rhs, lhs) => new AbstractSyntaxTreeLink(this, rhs)],
    [
      Operators.OR,
      (rhs, lhs) =>
        new AbstractSyntaxTreeLink(this, rhs) ||
        new AbstractSyntaxTreeLink(this, lhs),
    ],
    [
      Operators.XOR,
      (rhs, lhs) =>
        !new AbstractSyntaxTreeLink(this, rhs) &&
        !new AbstractSyntaxTreeLink(this, rhs),
    ],
    [
      Controls.EQUIVALENCE,
      (rhs, lhs) =>
        new AbstractSyntaxTreeLink(this, rhs) &&
        new AbstractSyntaxTreeLink(this, lhs) &&
        new AbstractSyntaxTreeLink(lhs, this) &&
        new AbstractSyntaxTreeLink(rhs, this),
    ],
    [
      Controls.IMPLICATION,
      (rhs, lhs) =>
        new AbstractSyntaxTreeLink(this, lhs) &&
        new AbstractSyntaxTreeLink(rhs, this),
    ],
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
