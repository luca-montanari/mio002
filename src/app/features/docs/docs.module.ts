import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsHomeComponent } from './docs-home/docs-home.component';
import { DocsTableComponent } from './docs-table/docs-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocsCreateUpdateDocDialogComponent } from './docs-create-update-doc-dialog/docs-create-update-doc-dialog.component';

@NgModule({
  declarations: [
    DocsHomeComponent,
    DocsTableComponent,
    DocsCreateUpdateDocDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
