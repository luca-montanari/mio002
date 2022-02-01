import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { DocsService } from 'src/app/db/services/docs.service';
import { DocsTableDataSource } from './docs-table.datasource';
import { OrderByCondition } from 'src/app/db/models/shared/orderByCondition';
import { DocsCreateUpdateDocDialogComponent } from '../docs-create-update-doc-dialog/docs-create-update-doc-dialog.component';
import { Doc } from 'src/app/db/models/docs/doc';

@Component({
    selector: 'mio002-docs-table',
    templateUrl: './docs-table.component.html',
    styleUrls: ['./docs-table.component.scss']
})
export class DocsTableComponent implements OnInit, OnDestroy {

    // Colonne visualizzate in tabella
    displayedColumns: string[] = ['code', 'description', 'category'];

    // DataSource della tabella
    dataSource: DocsTableDataSource = new DocsTableDataSource();

    constructor(private docsService: DocsService,
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
            console.log('@@@', 'DocsTableComponent', 'ngOnInit', 'getAllDocs', 'subscribe', docs);
            this.dataSource.setData(docs);            
        });        
    }

    ngOnDestroy(): void {
        console.log('@@@', 'DocsTableComponent', 'ngOnDestroy');
    }

    createNewDoc() {
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
                this.addDoc(docData);
            });
    }
    
    deleteSelectedDocs() {
        console.log('@@@', 'DocsTableComponent', 'deleteSelectedDocs');
    }

    private addDoc(docData: Partial<Doc>) {

        // docData.timestampClientAddDoc = Timestamp.now();                
        this.docsService.addDoc(docData)
            .subscribe(doc => {                        
                // getDoc(doc).then(a => console.log('oooooooo', a));
                console.log('dddddddddd', doc);
            });

    }

}
