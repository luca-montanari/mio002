import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material/material.module';
import { CollectionsInfosModule } from './collections-infos/collections-infos.module';
@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MaterialModule,
        CollectionsInfosModule
    ],
    exports: [
        MaterialModule,
        CollectionsInfosModule
    ]
})
export class SharedModule { }
