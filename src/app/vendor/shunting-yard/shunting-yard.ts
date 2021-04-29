import {Token, Tokens} from '@vendor/lexer/token';

export class ShuntingYard {
  private static operatorsOrder = new Map<string, number>([
    ['!', 9],
    ['+', 8],
    ['|', 7],
    ['^', 6],
    ['⇔', 5],
    ['→', 4],
    ['=', 3],
    ['?', 2],
  ]);

  constructor(private readonly source: Token[]) {
    let checkControl = false;
    for (const token of source) {
      if (token.value === '⇔' || token.value === '→') {
        checkControl = true;
      }
      switch (token.type) {
        case Tokens.Literal:
          this.output.push(token);
          break;
        case Tokens.Operator:
          for (
            let op = this.stack[this.stack.length - 1];
            op && ShuntingYard.compareOperators(op, token);
            op = this.stack[this.stack.length - 1]
          ) {
            this.output.push(op);
            this.stack.pop();
          }
          this.stack.push(token);
          break;
        case Tokens.LeftParenthesis:
          this.stack.push(token);
          break;
        case Tokens.RightParenthesis:
          while (true) {
            const stackToken = this.stack.pop();
            if (!stackToken) {
              throw new Error('Parenthesis error');
            }
            if (stackToken.type === Tokens.LeftParenthesis) {
              break;
            }
            this.output.push(stackToken);
          }
          break;
        default:
          throw new Error('Broken Token');
      }
    }
    if (!checkControl) {
      throw new Error('controller missing\n');
    }
    for (let token = this.stack.pop(); token; token = this.stack.pop()) {
      this.output.push(token);
    }
  }

  private readonly stack: Token[] = [];
  private readonly output: Token[] = [];

  private static compareOperators(lhs: Token, rhs: Token): boolean {
    const [lPriority, rPriority] = [
      ShuntingYard.operatorsOrder.get(lhs.value),
      ShuntingYard.operatorsOrder.get(rhs.value),
    ];
    if (!lPriority || !rPriority) {
      throw new Error('Unknown token Priority');
    }
    return lPriority >= rPriority;
  }

  get(): Token[] {
    return this.output;
  }
}
