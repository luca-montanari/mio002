import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { concatMap } from 'rxjs';

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

    @Input() collectionInfoRuntimeHandler: CollectionInfoRuntimeHandler | null = null;
    
    // Colonne visualizzate in tabella
    displayedColumns: string[] = ['code', 'description', 'category'];

    // DataSource della tabella
    dataSource: DocsTableDataSource = new DocsTableDataSource();

    constructor(private collectionsInfosService: CollectionsInfosService,
                private docsService: DocsService,
                private dialog: MatDialog) {
        console.log('@@@', 'DocsTableComponent', 'constructor');
    }

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

    ngOnDestroy(): void {
        console.log('@@@', 'DocsTableComponent', 'ngOnDestroy');
    }

    // public get collectionInfo(): CollectionInfo {
    //     return this.collectionsInfosService.getCollectionInfo(COLLECTION_NAME_DOCS);
    // }

    public createNewDoc() {
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
    
    public deleteSelectedDocs() {
        console.log('@@@', 'DocsTableComponent', 'deleteSelectedDocs');
    }

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
