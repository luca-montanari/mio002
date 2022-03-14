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

    /**
     * Caricamento dei dati nella griglia.
     * Scatta ogni volta che l'observable restituita emette un valore.
     * @returns observable con array di documenti mostrati in griglia
     */
    public connect(): Observable<Doc[]> {
        console.log('@@@', 'DocsDataSource', 'connect');
        return this.dataStream;
    }

    /**
     * Disconnessione dalla sorgente di dati.
     * Serve per rilasciare le risorse una volta che viene distrutto il componente che contiene la tabella
     */
    public disconnect(): void {
        console.log('@@@', 'DocsDataSource', 'disconnect');
        this.dataStream.complete();
    }

    // #endregion

    public get getData(): Doc[] {
        return this.dataStream.value;
    }

    public setData(docs: Doc[]) {
        this.dataStream.next(docs);
    }

    public get getDataCount(): number {
        return this.dataStream.value.length;
    }

}
