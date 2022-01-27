import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Doc } from 'src/app/db/models/docs/doc';

@Component({
    selector: 'mio002-docs-create-update-doc-dialog',
    templateUrl: './docs-create-update-doc-dialog.component.html',
    styleUrls: ['./docs-create-update-doc-dialog.component.scss']
})
export class DocsCreateUpdateDocDialogComponent {

    formGroup: FormGroup;
    doc: Doc;

    constructor(private matDialogRef: MatDialogRef<DocsCreateUpdateDocDialogComponent, Partial<Doc>>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) doc: Doc) {
        console.log('@@@', 'DocsCreateUpdateDocDialogComponent', 'constructor');
        this.doc = doc;
        this.formGroup = this.formBuilder.group({
            code: ['', Validators.required],
            description: ['', Validators.required],
            category: ['', Validators.required],
        });
    }

    cancel() {        
        console.log('@@@', 'DocsCreateUpdateDocDialogComponent', 'cancel');
        this.matDialogRef.close();
    }

    confirm() {        
        console.log('@@@', 'DocsCreateUpdateDocDialogComponent', 'confirm', this.formGroup);
        this.matDialogRef.close(this.formGroup.value);
    }

}
