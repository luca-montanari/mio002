import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable } from 'rxjs';

import { Doc } from "src/app/db/models/docs/doc";

export class DocsTableDataSource extends DataSource<Doc> {

    private dataStream = new BehaviorSubject<Doc[]>([]);

    constructor() {
        super();
        console.log('@@@', 'DocsDataSource', 'constructor');        
    }

    connect(): Observable<Doc[]> {
        console.log('@@@', 'DocsDataSource', 'connect');
        return this.dataStream;
    }

    disconnect() {
        console.log('@@@', 'DocsDataSource', 'disconnect');
        this.dataStream.complete();
    }

    setData(docs: Doc[]) {
        this.dataStream.next(docs);
    }

}
