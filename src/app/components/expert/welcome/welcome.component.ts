import { Component, OnInit } from '@angular/core';
import { EMPTY, fromEvent, Observable, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Lexer } from '@vendor/lexer/lexer';
import { Token } from '@vendor/lexer/token';
import { ShuntingYard } from '@vendor/shunting-yard/shunting-yard';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  test$?: Observable<string[]>;
  constructor() {}

  ngOnInit(): void {}
  uploadFile(files: FileList): void {
    Array.from(files).map((file) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      this.test$ = fromEvent(reader, 'load').pipe(
        first(),
        map((result) => {
          let binary = '';
          const bytes = new Uint8Array((result?.target as any).result);
          const length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return binary;
        }),
        map((data) =>
          Lexer.prepare(data)
            .map((str) => Token.tokenize(str))
            .map((tokens) => new ShuntingYard(tokens).get())
            .map((tokens) => tokens.map((token) => token.value).join(' '))
        )
      );
    });
  }
}
