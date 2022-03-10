import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DocsRoutingModule } from './docs-routing.module';
import { DocsHomeComponent } from './docs-home/docs-home.component';
import { DocsTableComponent } from './docs-table/docs-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocsCreateUpdateDocDialogComponent } from './docs-create-update-doc-dialog/docs-create-update-doc-dialog.component';
import { DocsTestComponent } from './docs-test/docs-test.component';
import { DocsAskConfirmationSnackbarComponent } from './docs-ask-confirmation-snackbar/docs-ask-confirmation-snackbar.component';

@NgModule({
  declarations: [
    DocsHomeComponent,
    DocsTableComponent,
    DocsCreateUpdateDocDialogComponent,
    DocsTestComponent,
    DocsAskConfirmationSnackbarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
