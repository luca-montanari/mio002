import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { LoadingData } from './models/loadingData';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private _loading = new BehaviorSubject<LoadingData>(this.getDefaultData());
    public readonly loading$ = this._loading.asObservable();

    constructor() { }

    public show(text: string) {
        this._loading.next(this.getData(text));
    }

    public hide() {
        this._loading.next(this.getDefaultData());
    }

    private getDefaultData(): LoadingData {
        const defaultData: LoadingData = {
            loading: false,
            text: undefined
        };
        return defaultData;
    }

    private getData(text: string): LoadingData {
        const data: LoadingData = {
            loading: true,
            text: text
        };
        return data;
    }

}
