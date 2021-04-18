import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpertRoutingModule } from './expert-routing.module';
import { ExpertComponent } from './expert.component';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({
  declarations: [
    ExpertComponent,
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    ExpertRoutingModule
  ]
})
export class ExpertModule { }
