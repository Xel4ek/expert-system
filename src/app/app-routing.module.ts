import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphComponent } from '@components/graph/graph.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@components/expert/expert.module').then(
        ({ ExpertModule }) => ExpertModule
      ),
  },
  {
    path: 'graph',
    component: GraphComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
