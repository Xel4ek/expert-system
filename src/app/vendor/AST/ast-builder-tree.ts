import {
  AbstractSyntaxTreeAtom,
  AbstractSyntaxTreeConnector,
  Controls,
  Operators
} from "@vendor/AST/abstract-syntax-tree-node";
import {Token, Tokens} from '@vendor/lexer/token';

export class AstBuilderTree {
  // root: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector;
  private readonly tokens: Token[][];

  constructor(
    tokens: Token[][]) {
    this.tokens = tokens;
    this.preBuilder();
  }

  private uniqueAtomNodes = new Map<string, AbstractSyntaxTreeAtom>();

  private preBuilder(): void {
    for (const tokens of this.tokens) {
      for (const token of tokens) {
        if (token.type === Tokens.Literal) {
          if (!this.uniqueAtomNodes.has(token.value)) {
            this.uniqueAtomNodes.set(token.value, new AbstractSyntaxTreeAtom());
          }
        }
      }
    }
  }

  // private connectorGenerator = new Map<Operators, (rhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector, lhs: AbstractSyntaxTreeAtom | AbstractSyntaxTreeConnector) => AbstractSyntaxTreeConnector>([
  //   [Operators.OR, (rhs, lhs) => {
  //
  //   }],
  //   ]
  // );

  private create(): void {
    const stack: Token[] = [];
    for (const tokens of this.tokens) {
      while (tokens.length) {
        const firstToken = tokens.pop();
        const secondToken = tokens.pop();
        const operatorToken = tokens.pop();
        if (firstToken && secondToken && this.uniqueAtomNodes.has(firstToken.value)
          && this.uniqueAtomNodes.has(secondToken.value) && operatorToken) {
          const firstNode = this.uniqueAtomNodes.get(firstToken.value);
          const secondNode = this.uniqueAtomNodes.get(secondToken.value);
          // @ts-ignore
          const generator = this.connectorGenerator.get(operatorToken.value);
          if (generator && firstNode && secondNode) {
            generator(firstNode, secondNode);
          }
          // const operatorNode = new AbstractSyntaxTreeConnector();
        }

      }
    }
  }

  showMe(): any {
    return this.uniqueAtomNodes;
  }
}
