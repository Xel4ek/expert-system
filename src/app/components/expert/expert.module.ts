import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpertRoutingModule } from './expert-routing.module';
import { ExpertComponent } from './expert.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DragAndDropModule } from '../../directives/drag-and-drop/drag-and-drop.module';

@NgModule({
  declarations: [ExpertComponent, WelcomeComponent],
  imports: [CommonModule, ExpertRoutingModule, DragAndDropModule],
})
export class ExpertModule {}
