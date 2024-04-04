import { Routes } from '@angular/router';

import {  AppChipsFormateurComponent } from './chips/chips.component';

import { AppMenuFormateurComponent } from './menu/menu.component';
import { AppBadgeFormateurComponent } from './badge/badge.component';
import { AppListsFormateurComponent } from './lists/lists.component';
import { AppTooltipsFormateurComponent } from './tooltips/tooltips.component';
import { ProfileFormateurComponent } from './profile-formateur/profile-formateur.component';
import { ListFormateurCoursComponent } from './list-formateur-cours/list-formateur-cours.component';
import { CourDetailsComponent } from './cour-details/cour-details.component';
import { ListQuestionsComponent } from './list-questions/list-questions.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [


      {
        path: 'cour-details/:id',
        component: CourDetailsComponent,
      },
      {
        path: 'profile-formateur',
        component: ProfileFormateurComponent,
      },
      {
        path: 'lists-questions',
        component: ListQuestionsComponent,
      },
      {
        path: 'badge',
        component: AppBadgeFormateurComponent,
      },
      {
        path: 'ajout-cour',
        component: AppChipsFormateurComponent,
      },
      {
        path: 'mes-cours',
        component: ListFormateurCoursComponent,
      },
      {
        path: 'lists',
        component: AppListsFormateurComponent,
      },
      {
        path: 'menu',
        component: AppMenuFormateurComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsFormateurComponent,
      },
    ],
  },
];
