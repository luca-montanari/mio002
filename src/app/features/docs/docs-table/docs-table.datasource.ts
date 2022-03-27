import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject, Observable } from 'rxjs';

import { Doc } from "src/app/db/models/docs/doc";
import { CollectionInfoRuntimeHandler } from 'src/app/db/models/shared/collectionsInfos/collection-info-runtime-handler';

export class DocsTableDataSource extends DataSource<Doc> {
    [x: string]: any;

    // #region Variables

    // #region Variables Private

    // Riceve in input i dati generali di gestione della collection
    public collectionInfoRuntimeHandler!: CollectionInfoRuntimeHandler;

    // #endregion

    // #region Variables Private

    /**
     * Store di tutti i documenti della collection
     */
    private _data = new BehaviorSubject<Doc[]>([]);

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
