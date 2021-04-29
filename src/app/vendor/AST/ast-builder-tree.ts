import {
  AbstractSyntaxTreeAtom,
  AbstractSyntaxTreeConnector,
  Controls,
  Operators,
} from '@vendor/AST/abstract-syntax-tree-node';
import { Token, Tokens } from '@vendor/lexer/token';

export class AstBuilderTree {
  // root: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector;
  private readonly tokens: Token[][];
  private uniqueAtomNodes = new Map<string, AbstractSyntaxTreeAtom>();

  constructor(tokens: Token[][]) {
    this.tokens = tokens;
    this.preBuilder();
    this.create();
  }

  showMe(): any {
    return this.uniqueAtomNodes;
  }

  // private connectorGenerator = new Map<Operators, (rhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector, lhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector) => AbstractSyntaxTreeConnector>([
  //   [Operators.OR, (rhs, lhs) => {
  //
  //   }],
  //   ]
  // );

  private preBuilder(): void {
    for (const tokens of this.tokens) {
      for (const token of tokens) {
        if (token.type === Tokens.Literal) {
          if (!this.uniqueAtomNodes.has(token.value)) {
            this.uniqueAtomNodes.set(
              token.value,
              new AbstractSyntaxTreeAtom(token)
            );
          }
        }
      }
    }
  }

  private create(): void {
    const stack: (AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector)[] = [];
    const copyTokens = this.tokens;
    for (const tokens of copyTokens) {
      for (const token of tokens) {
        if (token.type === Tokens.Literal) {
          const atom = this.uniqueAtomNodes.get(token.value);
          if (atom) {
            stack.push(atom);
          }
        }
        if (token.type === Tokens.Operator) {
          const takeOne = stack.pop();
          const takeSecond = stack.pop();
          if (takeOne && takeSecond) {
            const nextOne = new AbstractSyntaxTreeConnector(
              token.value as Operators,
              takeOne,
              takeSecond
            );
            stack.push(nextOne);
          }
        }
      }
    }
    console.log(stack);
  }
}
// }
