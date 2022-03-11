import { Component, Inject, OnInit } from '@angular/core';

import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { DocsAskConfirmationSnackbarData } from './docs-ask-confirmation-snackbar-data';

@Component({
    selector: 'mio002-docs-ask-confirmation-snackbar',
    templateUrl: './docs-ask-confirmation-snackbar.component.html',
    styleUrls: ['./docs-ask-confirmation-snackbar.component.scss']
})
export class DocsAskConfirmationSnackbarComponent implements OnInit {

    // #region Component LifeCycle

    /**
     * Costruttore
     * @param data accesso ai dati passati in input allo SnackBar
     */
    constructor(public matSnackBarRef: MatSnackBarRef<DocsAskConfirmationSnackbarComponent>,
                @Inject(MAT_SNACK_BAR_DATA) public matSnackBarData: DocsAskConfirmationSnackbarData) {
        console.log('@@@', 'DocsAskConfirmationSnackbarComponent', 'constructor');
    }

    /**
     * ngOnInit
     */
    ngOnInit(): void {
        console.log('@@@', 'DocsAskConfirmationSnackbarComponent', 'ngOnInit');
    }

    // #endregion

    // #region Methods

    // #region Methods Public

    public confirm() {
        console.log('@@@', 'DocsAskConfirmationSnackbarComponent', 'confirm');
        this.matSnackBarRef.dismissWithAction();
    }

    public cancel() {
        console.log('@@@', 'DocsAskConfirmationSnackbarComponent', 'confirm');
        this.matSnackBarRef.dismiss();
    }

    // #endregion

    // #endregion

}
