import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { catchError, concatMap, delay, finalize, map, Observable, of } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';

import { COLLECTION_NAME_DOCS, DocsService } from 'src/app/db/services/docs.service';
import { DocsTableDataSource } from './docs-table.datasource';
import { OrderByCondition } from 'src/app/db/models/shared/order-by-condition';
import { DocsCreateUpdateDocDialogComponent } from '../docs-create-update-doc-dialog/docs-create-update-doc-dialog.component';
import { Doc } from 'src/app/db/models/docs/doc';
import { CollectionsInfosService } from 'src/app/db/services/collections-infos.service';
import { CollectionInfo } from 'src/app/db/models/shared/collectionsInfos/collection-info';
import { CollectionInfoRuntimeHandler } from 'src/app/db/models/shared/collectionsInfos/collection-info-runtime-handler';
import { DocsAskConfirmationSnackbarComponent } from '../docs-ask-confirmation-snackbar/docs-ask-confirmation-snackbar.component';
import { DocsAskConfirmationSnackbarData } from '../docs-ask-confirmation-snackbar/docs-ask-confirmation-snackbar-data';
import { LoadingData } from 'src/app/shared/services/models/loadingData';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
    selector: 'mio002-docs-table',
    templateUrl: './docs-table.component.html',
    styleUrls: ['./docs-table.component.scss']
})
export class DocsTableComponent implements OnInit, OnDestroy {

    // #region Variables

    // #region Variables Public

    @Input() public collectionInfoRuntimeHandler!: CollectionInfoRuntimeHandler;

    // Colonne visualizzate in tabella
    public displayedColumns: string[] = ['select', 'code', 'description', 'category'];

    // Gestione delle selezioni dell'utente
    public selection = new SelectionModel<Doc>(true, []);

    // DataSource della tabella
    public dataSource: DocsTableDataSource = new DocsTableDataSource();

    // Flag per mostrare il progress spinner
    public loading$: Observable<LoadingData> = this._loadingService.loading$;

    // #endregion

    // #endregion

    // #region Component LifeCycle

    /**
     * Costruttore
     * @param _docsService - servizio per gestione della collection docs
     * @param _dialog - servizio per l'attivazione di dialog di anglur material
     * @param _snackBar - servizio che permette di mostrare SnackBar con messaggi o richieste di conferma
     */
    constructor(private _docsService: DocsService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _loadingService: LoadingService) {
        console.log('@@@', 'DocsTableComponent', 'constructor');
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        console.log('@@@', 'DocsTableComponent', 'ngOnInit');
        // Crea le condizioni di ordinamento da utilizzare nell'interrogazione
        const orderByConditions: OrderByCondition[] = [];
        const orderByCondition: OrderByCondition = {
            fieldName: 'code',
            orderByDirection: 'asc'
        };
        orderByConditions.push(orderByCondition);
        // Interroga il database per ricavare i dati da mostrare nella griglia
        try {
            this._loadingService.show('Caricamento dei dati in corso...');
            this._docsService.query(orderByConditions)
                .pipe(
                    catchError(err => {
                        this.showError(err);
                        return of([]);
                    }),
                    delay(500),
                    finalize(() => this._loadingService.hide())
                )
                .subscribe(docs => {
                    console.log('@@@', 'DocsTableComponent', 'ngOnInit', 'query', 'subscribe', docs);
                    this.dataSource.setData(docs);
                });
        } catch (error) {
            this.showError(error);
            this._loadingService.hide()
        }
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
            message = `i ${this.selection.selected.length} documenti selezionati`;
        }
        this.AskConfirmationWithSnackBar(`Sei sicuro di voler eliminare ${message}?`)
            .subscribe(confirmed => {
                console.log('@@@', 'DocsTableComponent', 'deleteSelectedDocs', 'AskConfirmationWithSnackBar', confirmed);
                if (confirmed) {
                    this.deleteSelectedDocsPrivate();
                }
            });
    }

    // #endregion

    // #region Metodi per la gestione dei documenti selezionati dall'utente

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

    // #region Metodi che eseguono un qualsiasi aggiornamento della collection

    /**
     * Crea un nuovo documento
     * @param docData - dati con cui create il documento
     */
    private createNewDocPrivate(docData: Partial<Doc>): void {
        console.log('@@@', 'DocsTableComponent', 'createNewDocPrivate');
        try {
            this._loadingService.show('Creazione del nuovo documento in corso...');
            this._docsService.createNewDoc(docData)
                .pipe(
                    concatMap(documentReference => {
                        return this._docsService.getDoc(documentReference);
                    }),
                    delay(500),
                    finalize(() => this._loadingService.hide())
                )
                .subscribe(documentSnapshot => {
                    console.log('@@@', 'DocsTableComponent', 'createNewDocPrivate', 'subscribe', documentSnapshot);
                    let newDoc: Doc | undefined = documentSnapshot.data();
                    if (!newDoc) {
                        throw new Error("La creazione del nuovo doc non è andata a buon fine");
                    }
                    const docs: Doc[] = this.dataSource.getData;
                    docs.push(newDoc);
                    this.dataSource.setData(docs);
                });
        } catch (error) {
            this.showError(error);
            this._loadingService.hide()
        }
    }

    /**
     * Elimina i documenti selezionati
     */
    private deleteSelectedDocsPrivate() {
        console.log('@@@', 'DocsTableComponent', 'deleteSelectedDocsPrivate');
        try {
            this._loadingService.show('Eliminazione dei documenti selezionati in corso...');
            this._docsService.deleteDocsByDocuments(this.selection.selected)
                .pipe(
                    delay(500),
                    catchError(err => {
                        this.showError(err);
                        return of(null);
                    }),
                    finalize(() => this._loadingService.hide())
                )
                .subscribe(() => {
                    console.log('@@@', 'DocsTableComponent', 'deleteSelectedDocsPrivate', 'subscribe');
                });
        } catch (error) {
            this.showError(error);
            this._loadingService.hide()
        }    
    }

    // #endregion

    // #region Metodi per la gestione dell'interfaccia utente

    /**
     * Chiede una conferma all'utente utilizzando Angular Material SnackBar
     * @param question - messaggio con la conferma da richiedere all'utente
     * @returns restituisce true se l'utente conferma altrimenti false
     */
    private AskConfirmationWithSnackBar(question: string): Observable<boolean> {
        console.log('@@@', 'DocsTableComponent', 'AskConfirmationWithSnackBar');
        // Dati da passare allo SnackBar
        const data: DocsAskConfirmationSnackbarData = {
            question: question,
            actionConfirmName: 'confirm',
            actionConfirmLabel: 'Continua',
            actionCancelName: 'cancel',
            actionCancelLabel: 'Annulla',
        }
        // Configurazione dello SnackBar
        const matSnackBarConfig: MatSnackBarConfig<DocsAskConfirmationSnackbarData> = {
            announcementMessage: question,
            verticalPosition: 'top',
            data: data,
            panelClass: 'test',
            duration: 10000
        }
        // Apre lo SnackBar
        const matSnackBarRef: MatSnackBarRef<DocsAskConfirmationSnackbarComponent> = this._snackBar.openFromComponent(DocsAskConfirmationSnackbarComponent, matSnackBarConfig);
        // Si mette in ascolto degli eventi emessi dallo SnackBar
        return matSnackBarRef.afterDismissed().pipe(map(matSnackBarDismiss => matSnackBarDismiss.dismissedByAction));
    }

    /**
     * Mostra un messaggio di errore all'utente
     */
    private showError(err: any): void {
        console.log('@@@', 'DocsTableComponent', 'showError', err);
        this._snackBar.open(err, 'Chiudi')
    }

    // #endregion

    // #endregion

    // #endregion

}
