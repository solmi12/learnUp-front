import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { AppDashboardFormateurComponent } from './dashboard/dashboard.component';
import { MaterialModule } from 'src/app/material.module';
import { PagesFormateurRoutes } from './pages-formateur.routing.module';


@NgModule({
  declarations: [AppDashboardFormateurComponent],
  imports: [
  
    MaterialModule,
    CommonModule,
    FormsModule,
    NgApexchartsModule,
    RouterModule.forChild(PagesFormateurRoutes),
    TablerIconsModule.pick(TablerIcons),
  ],
  exports: [TablerIconsModule],
})
export class PagesFormateurModule {}
