import { Component, OnInit } from '@angular/core';

import { DocsService } from 'src/app/db/services/docs.service';
import { DocsTableDataSource } from './docs-table.datasource';
import { OrderByCondition } from 'src/app/db/models/shared/orderByCondition';
import { orderBy } from 'firebase/firestore';

@Component({
    selector: 'mio002-docs-table',
    templateUrl: './docs-table.component.html',
    styleUrls: ['./docs-table.component.scss']
})
export class DocsTableComponent implements OnInit {

    // Colonne visualizzate in tabella
    displayedColumns: string[] = ['code', 'description', 'category'];

    // DataSource della tabella
    dataSource: DocsTableDataSource = new DocsTableDataSource();

    constructor(private docsService: DocsService) {
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
        this.docsService.getDocs(orderByConditions).subscribe(docs => {
            console.log('@@@', 'DocsTableComponent', 'ngOnInit', 'getAllDocs', 'subscribe', docs);
            this.dataSource.setData(docs);            
        });        
    }

    createNewDoc() {
        console.log('@@@', 'DocsTableComponent', 'createNewDoc');
    }

    deleteSelectedDocs() {
        console.log('@@@', 'DocsTableComponent', 'deleteSelectedDocs');
    }

}
