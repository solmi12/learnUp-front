import { Routes } from '@angular/router';
import { AppDashboardFormateurComponent } from 'src/app/view-formateur/pages/dashboard/dashboard.component';

export const PagesFormateurRoutes: Routes = [
  {
    path: '',
    component: AppDashboardFormateurComponent,
    data: {
      title: 'Starter Page',
    },
  },

];
