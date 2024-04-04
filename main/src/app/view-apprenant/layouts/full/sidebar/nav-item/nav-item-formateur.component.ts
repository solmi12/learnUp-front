import { Component, Inject, Input, OnChanges } from '@angular/core';

import { Router } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';
import type { NavItem } from './nav-item';

@Component({
  selector: 'app-nav-item-apprenant',
  templateUrl: './nav-item-apprenant.component.html',
  styleUrls: [],
})
export class AppNavItemApprenantComponent implements OnChanges {
  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(@Inject(NavService) public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
      }
    });
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }

    // scroll
    document.querySelector('.page-wrapper')?.scroll({
      top: 0,
      left: 0,
    });
  }
}
