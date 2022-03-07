import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocsHomeComponent } from './docs-home/docs-home.component';

const routes: Routes = [{ path: '', component: DocsHomeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
