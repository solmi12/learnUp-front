import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { ProfilAdminComponent } from './profil-admin/profil-admin.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'pending-cour',
        component: AppMenuComponent,
      },
      {
        path: 'profile',
        component: ProfilAdminComponent,
      },
      {
        path: 'cours',
        component: AppTooltipsComponent,
      },
    ],
  },
];
