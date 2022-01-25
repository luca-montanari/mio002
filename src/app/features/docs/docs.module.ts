import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsHomeComponent } from './docs-home/docs-home.component';


@NgModule({
  declarations: [
    DocsHomeComponent
  ],
  imports: [
    CommonModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
