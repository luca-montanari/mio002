import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home/home.component';
import { PageNotFoundComponent } from './features/home/page-not-found/page-not-found.component';

const routes: Routes = [
    { path: 'docs', loadChildren: () => import('./features/docs/docs.module').then(m => m.DocsModule) },
    { path: '', component: HomeComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
