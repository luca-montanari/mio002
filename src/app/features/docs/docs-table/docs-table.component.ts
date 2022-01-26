import { Component, OnInit } from '@angular/core';

import { DocsService } from 'src/app/db/services/docs.service';

@Component({
  selector: 'mio002-docs-table',
  templateUrl: './docs-table.component.html',
  styleUrls: ['./docs-table.component.scss']
})
export class DocsTableComponent {

  constructor(private docsService: DocsService) {
    console.log('@@@', 'DocsTableComponent', 'constructor');
    // this.allDocs = docsService.getAllDocs();
    // docsService.getAllDocs().subscribe(docs => {
    //     console.log('@@@', 'DocsHomeComponent', 'getAllDocs', 'subscribe', docs);
    // });
  }

}
