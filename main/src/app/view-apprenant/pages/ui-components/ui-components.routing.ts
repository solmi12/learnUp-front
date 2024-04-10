import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppChipsApprenantComponent } from './chips/chips.component';
import { MesApprentissagesComponent } from './mes-apprentissages/mes-apprentissages.component';
import { ListSouhaitComponent } from './list-souhait/list-souhait.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profil-apprenant',
        component: AppBadgeComponent,
      },
     
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'listes-reponses',
        component: AppChipsApprenantComponent,
      },
      {
        path: 'Listes-Souhaits',
        component: ListSouhaitComponent,
      },
      {
        path: 'menu',
        component: AppMenuComponent,
      },
      {
        path: 'mes-courses',
        component: MesApprentissagesComponent,
      },
      {
        path: 'cour/:id',
        component: AppTooltipsComponent,
      },
    ],
  },
];
