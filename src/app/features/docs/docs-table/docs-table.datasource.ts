import { DataSource } from '@angular/cdk/collections';
import { Input } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Doc } from "src/app/db/models/docs/doc";

export class DocsTableDataSource extends DataSource<Doc> {

    private dataStream = new BehaviorSubject<Doc[]>([]);

    // #region LifeCycle

    /**
     * Costruttore
     */
    constructor() {
        super();
        console.log('@@@', 'DocsDataSource', 'constructor');        
    }

    // #endregion

    // #region DataSource

    connect(): Observable<Doc[]> {
        console.log('@@@', 'DocsDataSource', 'connect');
        return this.dataStream;
    }

    disconnect() {
        console.log('@@@', 'DocsDataSource', 'disconnect');
        this.dataStream.complete();
    }

    // #endregion

    public get getData () {
        return this.dataStream.value;
    }

    public setData(docs: Doc[]) {
        this.dataStream.next(docs);
    }

    public get getDataCount(): number {
        return this.dataStream.value.length;
    }

}
