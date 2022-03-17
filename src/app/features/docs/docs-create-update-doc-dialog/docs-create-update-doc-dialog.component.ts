import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Doc } from 'src/app/db/models/docs/doc';

export type CreateOrUpdate = 'create' | 'update';

@Component({
    selector: 'mio002-docs-create-update-doc-dialog',
    templateUrl: './docs-create-update-doc-dialog.component.html',
    styleUrls: ['./docs-create-update-doc-dialog.component.scss']
})
export class DocsCreateUpdateDocDialogComponent {

    // #region Variables

    // #region Variables Public

    /**
     * Gestione dei reactive form
     */
    public formGroup: FormGroup;

    /**
     * Documento da aggiornare
     */
    public doc: Doc;

    /**
     * Funzionalità richiesta
     */
    public mode: CreateOrUpdate;

    // #endregion

    // #region LifeCycle

    /**
     * Costruttore
     * @param matDialogRef - servizio per poter avere accesso al dialog
     * @param formBuilder - servizio per la gestione dei reactive form
     * @param doc - documento da aggiornare (se siamo in modalità di aggiornamento)
     */
    constructor(private matDialogRef: MatDialogRef<DocsCreateUpdateDocDialogComponent, Partial<Doc>>,
                private formBuilder: FormBuilder,
                @Inject(MAT_DIALOG_DATA) doc: Doc) {
        console.log('@@@', 'DocsCreateUpdateDocDialogComponent', 'constructor', doc);
        // Eventuale documento da aggiornare        
        this.doc = doc;
        // Se il documento da aggiornare è valorizato significa che sia in modalità di aggiornamento altrimenti siamo in modalità di creazione di un nuovo documento
        this.mode = this.doc ? 'update' : 'create';
        // Configurazione del reactive form
        this.formGroup = this.formBuilder.group({
            code: [doc?.code ?? '', Validators.required],
            description: [doc?.description ?? '', Validators.required],
            category: [doc?.category ?? '', Validators.required],
        });
    }

    // #endregion

    // #region Methods

    // #region Methods Public

    /**
     * Annulla l'aggiornamento o la creazione del documento
     */
    public cancel(): void {        
        console.log('@@@', 'DocsCreateUpdateDocDialogComponent', 'cancel');
        this.matDialogRef.close();
    }

    /**
     * Conferma dell'aggiornamento o della creazione del documento
     */
    public confirm(): void {        
        console.log('@@@', 'DocsCreateUpdateDocDialogComponent', 'confirm', this.formGroup);
        this.matDialogRef.close(this.formGroup.value);
    }

    /**
     * Restituisce il titolo da assegnare al dialog
     */
    public getMatDialogTitle(): string {
        return this.mode === 'create' ? "Crea nuovo Doc" : "Modifica il Doc";
    }

    // #endregion

    // #endregion

}
