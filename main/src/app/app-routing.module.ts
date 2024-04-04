import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { FullFormateurComponent } from './view-formateur/layouts/full/full.component';
import { FullApprenantComponent } from './view-apprenant/layouts/full/full.component';
const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
  
     
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
      },
    ],
  },

  {
    path: '',
    component: FullFormateurComponent,
    children: [
      {
        path: '',
        redirectTo: '/Dashboard-formateur',
        pathMatch: 'full',
      },
      {
        path: 'Dashboard-formateur',
        loadChildren: () =>
          import('../app/view-formateur/pages/pages-formateur.module').then((m) => m.PagesFormateurModule),
      },
  
     
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./view-formateur/pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./view-formateur/pages/extra/extra.module').then((m) => m.ExtraModule),
      },
    ],
  },


  {
    path: '',
    component: FullApprenantComponent,
    children: [
      {
        path: '',
        redirectTo: '/Dashboard-apprenant',
        pathMatch: 'full',
      },
      {
        path: 'Dashboard-apprenant',
        loadChildren: () =>
          import('./view-apprenant/pages/pages-apprenant.module').then((m) => m.PagesApprenantModule),
      },
  
     
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./view-apprenant/pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./view-apprenant/pages/extra/extra.module').then((m) => m.ExtraModule),
      },
    ],
  },



  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
