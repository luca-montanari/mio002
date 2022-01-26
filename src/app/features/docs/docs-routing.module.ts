import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsHomeComponent } from './docs-home/docs-home.component';
import { DocsTableComponent } from './docs-table/docs-table.component';

const routes: Routes = [{ path: '', component: DocsTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
