export type Tokens =
  | 'operator'
  | 'literal'
  | 'leftParenthesis'
  | 'rightParenthesis';

export class Token {
  type: Tokens;
  value: string;

  constructor(type: Tokens, value: string) {
    this.type = type;
    this.value = value;
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

  private static getToken(letter: string): Token {
    if (Token.ifOperator(letter)) {
      return new Token('operator', letter);
    }
    if (Token.isLeftParenthesis(letter)) {
      return new Token('leftParenthesis', letter);
    }
    if (Token.isRightParenthesis(letter)) {
      return new Token('rightParenthesis', letter);
    }
    return new Token('literal', letter);
  }

  static tokenize(source: string): Token[] {
    return source.split('').map((letter) => {
      return Token.getToken(letter);
    });
  }
}
