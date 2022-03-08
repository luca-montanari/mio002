import { Component, Input, OnInit } from '@angular/core';

import { CollectionInfoRuntimeHandler } from 'src/app/db/models/shared/collectionsInfos/collection-info-runtime-handler';

@Component({
    selector: 'mio002-docs-test',
    templateUrl: './docs-test.component.html',
    styleUrls: ['./docs-test.component.scss']
})
export class DocsTestComponent implements OnInit {

    @Input() collectionInfoRuntimeHandler!: CollectionInfoRuntimeHandler;

    constructor() { }

    ngOnInit(): void {
    }

}
