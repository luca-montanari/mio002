import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const loadingText1: string = 'Inizializzazione dell\'accesso al database...';

@Component({
  selector: 'mio002-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(private router: Router) {
        console.log('@@@', 'HomeComponent', 'constructor');        
    }

    openDocs() {        
        this.router.navigate(['/docs']);
    }

}
