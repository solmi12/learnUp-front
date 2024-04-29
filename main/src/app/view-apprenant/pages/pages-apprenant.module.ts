import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { MaterialModule } from 'src/app/material.module';
import { AppDashboardApprenantComponent } from './dashboard/dashboard.component';
import { PagesApprenantRoutes } from './pages-apprenant.routing.module';
import { SocketService } from 'src/app/services/socket.service';
import { VideoCallComponent } from 'src/app/video-call/video-call.component';


@NgModule({
  declarations: [AppDashboardApprenantComponent],
  imports: [
  
  
    MaterialModule,
    CommonModule,
    FormsModule,
    NgApexchartsModule,
    RouterModule.forChild(PagesApprenantRoutes),
    TablerIconsModule.pick(TablerIcons),
  ],
  providers: [
    SocketService, 
  ],
  exports: [TablerIconsModule],
})
export class PagesApprenantModule {}
