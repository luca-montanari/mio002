import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mio002-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(private router: Router) {
        console.log('@@@', 'HomeComponent', 'constructor');        
    }

    OpenDocs() {
        this.router.navigate(['/docs']);
    }

}
