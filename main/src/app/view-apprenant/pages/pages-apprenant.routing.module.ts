import { Routes } from '@angular/router';
import { AppDashboardApprenantComponent } from './dashboard/dashboard.component';

export const PagesApprenantRoutes: Routes = [
  {
    path: '',
    component: AppDashboardApprenantComponent,
    data: {
      title: 'Starter Page',
    },
  },

];
