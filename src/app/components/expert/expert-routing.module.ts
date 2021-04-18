import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertComponent } from '@components/expert/expert.component';
import { WelcomeComponent } from '@components/expert/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: ExpertComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpertRoutingModule {}
