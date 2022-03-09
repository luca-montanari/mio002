import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { concatMap } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

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
    constructor(private collectionsInfosService: CollectionsInfosService,
        private docsService: DocsService,
        private dialog: MatDialog) {
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
        this.docsService.query(orderByConditions).subscribe(docs => {
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

    // #region Modifica dei dati del database

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
        const matDialogRef: MatDialogRef<DocsCreateUpdateDocDialogComponent, Partial<Doc>> = this.dialog.open<DocsCreateUpdateDocDialogComponent>(DocsCreateUpdateDocDialogComponent, dialogConfig);
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



        
    }

    // #endregion

    // #region Gestione dei doc selezionati dall'utente

    /**
     * Sono selezionati tutti i docs visibili nella pagina corrente?
     * @returns restituisce true se sono selezionati tutti i docs visibili nella pagina corrente
     */
    isAllSelected(): boolean {
        return this.selection.selected?.length == this.dataSource.getDataCount;
    }

    /**
     * L'utente ha selezionato almeno un doc?
     * @returns restitituisce true se l'utente ha selezionato almeno un doc
     */
    existsAtLeastOneSelection(): boolean {
        return this.selection.selected?.length > 0;
    }

    /**
     * Determina lo stato del checkbox header della colonna di selezione
     */
    toggleAll(): void {
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
     toggleDoc(doc: Doc): void {
        this.selection.toggle(doc);
        console.log('xxxxxxxxxxxxxxxx', this.selection.selected);
    }
    
    // #endregion

    // #endregion

    // #endregion





    private createNewDocPrivate(docData: Partial<Doc>) {
        this.docsService.createNewDoc(docData)
            .pipe(
                concatMap(documentReference => {
                    return this.docsService.getDoc(documentReference);
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
