import { OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    template: `
        <div>Product Definition Loading ... </div>
    `
})

export class LoadProductDefinitionComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.navigate(['/setup/product/product-definition']);
    }
}