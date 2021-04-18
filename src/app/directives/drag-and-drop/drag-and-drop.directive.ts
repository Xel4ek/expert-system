import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
})
export class DragAndDropDirective {
  @Output() appOnFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#f5fcff';
  @HostBinding('style.opacity') private opacity = '1';

  @HostListener('dragover', ['$event'])
  onDragOver(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8';
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: Event): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';
  }

  @HostListener('drop', ['$event'])
  public ondrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';
    const files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      this.appOnFileDropped.emit(files);
    }
  }
}
