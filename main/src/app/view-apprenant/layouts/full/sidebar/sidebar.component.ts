import { Component, Inject, OnInit } from '@angular/core';
import { navItems } from 'src/app/view-apprenant/layouts/full/sidebar/sidebar-data';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-sidebar-apprenant',
  templateUrl: './sidebar-apprenant.component.html',
})
export class SidebarApprenantComponent implements OnInit {
  navItems = navItems;

  constructor(@Inject(NavService) public navService: NavService) {}

  ngOnInit(): void {}
}
