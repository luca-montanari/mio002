import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable } from 'rxjs';

import { Doc } from "src/app/db/models/docs/doc";
import { CollectionInfoRuntimeHandler } from 'src/app/db/models/shared/collectionsInfos/collection-info-runtime-handler';

export class DocsTableDataSource extends DataSource<Doc> {
    
    // #region Variables

    // #region Variables Public

    public collectionInfoRuntimeHandler!: CollectionInfoRuntimeHandler;

    // #endregion

    // #region Variables Private

    private _data = new BehaviorSubject<Doc[]>([]);

    private _pagesize: number;

    // #endregion

    // #endregion    

    // #region Properties

    // #region Properties Public

    public get pageSize(): number {
        return this._pagesize;
    }

    public set pageSize(pageSize: number) {
        this._pagesize = pageSize;
    }

    // #endregion

    // #region Properties Private

    private get data(): Doc[] {
        return this._data.value;
    }

    // #endregion

    // #endregion    

    // #region LifeCycle

    /**
     * Costruttore
     */
    constructor() {
        super();
        console.log('@@@', 'DocsDataSource', 'constructor');
    }

    // #endregion

    // #region Extends DataSource

    /**
     * Caricamento dei dati nella griglia.
     * Scatta ogni volta che l'observable restituita emette un valore.
     * @returns observable con array di documenti mostrati in griglia
     */
    public connect(): Observable<Doc[]> {
        console.log('@@@', 'DocsDataSource', 'connect');
        return this._data;
    }

    /**
     * Disconnessione dalla sorgente di dati.
     * Serve per rilasciare le risorse una volta che viene distrutto il componente che contiene la tabella
     */
    public disconnect(): void {
        console.log('@@@', 'DocsDataSource', 'disconnect');
        this._data.complete();
    }

    // #endregion

    // #region Methods

    // #region Methods Public
    
    public loadPage(pageIndex: number) {
        console.log('@@@', 'DocsDataSource', 'loadPage');
        const indexLastDocumentTbLoaded = ((pageIndex + 1) * this.pageSize) - 1;
        if (this.data.length > indexLastDocumentTbLoaded + 1) {
            this.loadPage
        }
    }

    // #endregion

    // #region Methods Private
    
    private loadPageFromDb(pageIndex: number) {
        console.log('@@@', 'DocsDataSource', 'loadPageFromDb');
    }

    private loadPageFromMemory(pageIndex: number) {
        console.log('@@@', 'DocsDataSource', 'loadPageFromDb');
    }

    // #endregion

    // #endregion









    // public getData(): Doc[] {
    //     return this._data.value;
    // }

    // public setData(docs: Doc[]) {
    //     this.dataStream.next(docs);
    // }

    // public getDataCount(): number {
    //     return this.dataStream.value.length;
    // }

}
