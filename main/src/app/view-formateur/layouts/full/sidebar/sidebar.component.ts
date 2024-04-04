import { Component, Inject, OnInit } from '@angular/core';
import { navItems } from 'src/app/view-formateur/layouts/full/sidebar/sidebar-data';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-sidebar-formateur',
  templateUrl: './sidebar-formateur.component.html',
})
export class SidebarFormateurComponent implements OnInit {
  navItems = navItems;

  constructor(@Inject(NavService) public navService: NavService) {}

  ngOnInit(): void {}
}
