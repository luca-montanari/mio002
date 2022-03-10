import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { concatMap } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { COLLECTION_NAME_DOCS, DocsService } from 'src/app/db/services/docs.service';
import { DocsTableDataSource } from './docs-table.datasource';
import { OrderByCondition } from 'src/app/db/models/shared/order-by-condition';
import { DocsCreateUpdateDocDialogComponent } from '../docs-create-update-doc-dialog/docs-create-update-doc-dialog.component';
import { Doc } from 'src/app/db/models/docs/doc';
import { CollectionsInfosService } from 'src/app/db/services/collections-infos.service';
import { CollectionInfo } from 'src/app/db/models/shared/collectionsInfos/collection-info';
import { CollectionInfoRuntimeHandler } from 'src/app/db/models/shared/collectionsInfos/collection-info-runtime-handler';

@Component({
    selector: 'mio002-docs-table',
    templateUrl: './docs-table.component.html',
    styleUrls: ['./docs-table.component.scss']
})
export class DocsTableComponent implements OnInit, OnDestroy {

    // #region Variables

    // #region Variables Public

    @Input() collectionInfoRuntimeHandler!: CollectionInfoRuntimeHandler;

    // Colonne visualizzate in tabella
    displayedColumns: string[] = ['select', 'code', 'description', 'category'];

    // Gestione delle selezioni dell'utente
    selection = new SelectionModel<Doc>(true, []);

    // DataSource della tabella
    dataSource: DocsTableDataSource = new DocsTableDataSource();

    // #endregion

    // #endregion

    // #region Component LifeCycle

    /**
     * Costruttore
     * @param collectionsInfosService servizio per accesso ai CollectionInfo
     * @param docsService - servizio per gestione della collection docs
     * @param dialog - servizio per l'attivazione di dialog di anglur material
     */
    constructor(private _collectionsInfosService: CollectionsInfosService,
                private _docsService: DocsService,
                private _dialog: MatDialog,
                private _snackBar: MatSnackBar) {
        console.log('@@@', 'DocsTableComponent', 'constructor');
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        console.log('@@@', 'DocsTableComponent', 'ngOnInit');
        const orderByConditions: OrderByCondition[] = [];
        const orderByCondition: OrderByCondition = {
            fieldName: 'code',
            orderByDirection: 'asc'
        };
        orderByConditions.push(orderByCondition);
        this._docsService.query(orderByConditions).subscribe(docs => {
            console.log('@@@', 'DocsTableComponent', 'ngOnInit', 'query', 'subscribe', docs);
            this.dataSource.setData(docs);
        });
    }

    /**
     * ngOnDestroy
     */
    ngOnDestroy(): void {
        console.log('@@@', 'DocsTableComponent', 'ngOnDestroy');
    }

    // #endregion

    // #region Methods

    // #region Methods Public

    // #region Metodi che eseguono un qualsiasi aggiornamento della collection

    /**
     * Creazione di un nuovo doc utilizzando il dialog di angular material
     */
    public createNewDoc(): void {
        console.log('@@@', 'DocsTableComponent', 'createNewDoc');
        const dialogConfig = new MatDialogConfig<DocsCreateUpdateDocDialogComponent>();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";
        dialogConfig.data = null;
        dialogConfig.closeOnNavigation = false;
        const matDialogRef: MatDialogRef<DocsCreateUpdateDocDialogComponent, Partial<Doc>> = this._dialog.open<DocsCreateUpdateDocDialogComponent>(DocsCreateUpdateDocDialogComponent, dialogConfig);
        matDialogRef
            .afterClosed()
            .subscribe(docData => {
                console.log('@@@', 'DocsTableComponent', 'createNewDoc', 'matDialogRef', 'subscribe', docData);
                if (!docData) {
                    console.log('@@@', 'DocsTableComponent', 'createNewDoc', 'matDialogRef', 'subscribe', 'chiuso il dialog annullando la modifica');
                    return;
                }
                console.log('@@@', 'DocsTableComponent', 'createNewDoc', 'matDialogRef', 'subscribe', 'chiuso il dialog confermando la modifica');
                this.createNewDocPrivate(docData);
            });
    }

    /**
     * Eliminazione dei records selezionati
     */
    public deleteSelectedDocs() {
        console.log('@@@', 'DocsTableComponent', 'deleteSelectedDocs');
        // Verifica che il comando sia utilizzabille
        if (!this.existsAtLeastOneSelection()) {
            throw new Error('Non ci sono documenti selezionati da eliminare');
        }
        // Richiede conferma all'utente prima di eliminare i documenti selezionati
        let message: string = '';
        if (this.selection.selected.length === 1) {
            message = `il documento selezionato`;                
        } else {
            message = `i documenti ${this.selection.selected.length} selezionati`;
        }
        if (!this.AskConfirmationWithSnackBar(`Sei sicuro di voler eliminare ${message}?`)) {
            return;
        }
        this._docsService.deleteDocsByDocuments(this.selection.selected);
    }

    // #endregion

    // #region Metodi per la gestione dei doc selezionati dall'utente

    /**
     * Sono selezionati tutti i docs visibili nella pagina corrente?
     * @returns restituisce true se sono selezionati tutti i docs visibili nella pagina corrente
     */
    public isAllSelected(): boolean {
        return this.selection.selected?.length == this.dataSource.getDataCount;
    }

    /**
     * L'utente ha selezionato almeno un doc?
     * @returns restitituisce true se l'utente ha selezionato almeno un doc
     */
    public existsAtLeastOneSelection(): boolean {
        return this.selection.selected?.length > 0;
    }

    /**
     * Determina lo stato del checkbox header della colonna di selezione
     */
    public toggleAll(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.selection.select(...this.dataSource.getData);
        }
    }

    /**
     * Gestisce la modifica dello stato di selezione di un documento di doc
     * @param doc documento di doc per il quale è cambiato lo stato di selezione
     */
    public toggleDoc(doc: Doc): void {
        this.selection.toggle(doc);
        console.log('xxxxxxxxxxxxxxxx', this.selection.selected);
    }
    
    // #endregion

    // #region Metodi per la gestione dell'interfaccia utente

    /**
     * Costruisce il tooltip da mostrare per il pulsante che permette l'eliminazione di tutti i documenti selezionati
     * @returns restituisce il tooltip da mostrare
     */
    public GetTooltipForButtonDeleteSelectedDocs(): string {
        if (this.existsAtLeastOneSelection()) {
            let message: string = '';
            if (this.selection.selected.length === 1) {
                message = `il documento selezionato`;                
            } else {
                message = `i documenti ${this.selection.selected.length} selezionati`;
            }
            return `Elimina ${message}`;
        } else {
            return 'Elimina i documenti selezionati (non utilizzabile perchè non ci sono documenti selezionati)';
        }        
    }

    // #endregion

    // #endregion

    // #region Methods Private

    /**
     * Chiede una conferma all'utente utilizzando Angular Material SnackBar
     * @param question - messaggio con la conferma da richiedere all'utente
     * @returns restituisce true se l'utente conferma altrimenti false
     */
    private AskConfirmationWithSnackBar(question: string): boolean {
        const matSnackBarConfig: MatSnackBarConfig = {
            verticalPosition: 'top'
        }
        this._snackBar.open(question, 'bbbaaaaaaaaa', matSnackBarConfig);
        return false;
    }

    // #endregion

    // #endregion





    private createNewDocPrivate(docData: Partial<Doc>) {
        this._docsService.createNewDoc(docData)
            .pipe(
                concatMap(documentReference => {
                    return this._docsService.getDoc(documentReference);
                })
            )
            .subscribe(documentSnapshot => {
                let newDoc: Doc | undefined = documentSnapshot.data();
                if (!newDoc) {
                    throw new Error("La creazione del nuovo doc non è andata a buon fine");
                }
                const docs: Doc[] = this.dataSource.getData;
                docs.push(newDoc);
                this.dataSource.setData(docs);
            });

    }

}
