import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsHomeComponent } from './docs-home/docs-home.component';
import { DocsTableComponent } from './docs-table/docs-table.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DocsHomeComponent,
    DocsTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
