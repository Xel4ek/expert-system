export const enum Tokens {
  Operator = 'operator',
  Literal = 'literal',
  LeftParenthesis = 'leftParenthesis',
  RightParenthesis = 'rightParenthesis',
}

export class Token {
  type: Tokens;
  value: string;

  constructor(type: Tokens, value: string) {
    this.type = type;
    this.value = value;
  }

  static tokenize(source: string): Token[] {
    return source.split('').map((letter) => {
      return Token.getToken(letter);
    });
  }

  private static ifOperator(letter: string): boolean {
    return /[!|+^⇔→=?]/.test(letter);
  }

  private static isLeftParenthesis(letter: string): boolean {
    return letter === '(';
  }

  private static isRightParenthesis(letter: string): boolean {
    return letter === ')';
  }

  private static isLiteral(letter: string): boolean {
    return /[A-Z]/.test(letter);
  }

  private static getToken(letter: string): Token {
    if (Token.ifOperator(letter)) {
      return new Token(Tokens.Operator, letter);
    }
    if (Token.isLeftParenthesis(letter)) {
      return new Token(Tokens.LeftParenthesis, letter);
    }
    if (Token.isRightParenthesis(letter)) {
      return new Token(Tokens.RightParenthesis, letter);
    }
    if (Token.isLiteral(letter)) {
      return new Token(Tokens.Literal, letter);
    }
    throw new Error('Unknown token ' + letter);
  }
}
