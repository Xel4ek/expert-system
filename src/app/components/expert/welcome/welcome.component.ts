import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  test$: Observable<string>[] = [];
  constructor() {}

  ngOnInit(): void {}
  uploadFile(files: FileList): void {
    Array.from(files).map((file) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      const data$ = fromEvent(reader, 'load').pipe(
        first(),
        map((result) => {
          let binary = '';
          const bytes = new Uint8Array((result?.target as any).result);
          const length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          return binary;
        })
      );
      this.test$.push(data$);
    });
  }
}
