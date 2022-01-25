import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DbModule } from './db/db.module';
import { DocsModule } from './features/docs/docs.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DbModule,
        DocsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
