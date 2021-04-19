import { ASTNode } from '../AST/astnode';

export class Lexer {
  source: string[];
  constructor(source: string) {
    this.source = Lexer.prepare(source);
  }
  static prepare(source: string): string[] {
    return source
      .replace(/#.*?[\r]?\n/g, '\n')
      .split('\n')
      .filter((str) => str.trim().length)
      .map((str) =>
        str.replace(/\s+/g, '').replace(/<=>/g, '⇔').replace(/=>/g, '→')
      );
  }
  // static tokenize<T extends ASTNode>(source: string): T {
  //   const stack: string[] = [];
  //
  //   throw new Error('No implement yet');
  // }
}
