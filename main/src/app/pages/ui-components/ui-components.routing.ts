import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { ProfilAdminComponent } from './profil-admin/profil-admin.component';
import { PaymentAdminComponent } from './payment-admin/payment-admin.component';
import { ListApprenantCourComponent } from './list-apprenant-cour/list-apprenant-cour.component';
import { AddUserComponent } from './add-user/add-user.component';

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
        path: 'payment/:apprenantId',
        component: PaymentAdminComponent,
      },
      {
        path: 'profile',
        component: ProfilAdminComponent,
      },
      {
        path: 'nouveau-user',
        component: AddUserComponent,
      },
      {
        path: 'PaymentCour',
        component: ListApprenantCourComponent,
      },
      {
        path: 'cours',
        component: AppTooltipsComponent,
      },
    ],
  },
];
