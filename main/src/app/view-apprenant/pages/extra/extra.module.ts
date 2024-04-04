import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { ExtraRoutes } from './extra.routing';
import { AppIconsComponent } from './icons/icons.component';
import { AppSamplePageComponent } from './sample-page/sample-page.component';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  imports: [
  CommonModule,
  RouterModule.forChild(ExtraRoutes),

  FormsModule,
  ReactiveFormsModule,
  TablerIconsModule.pick(TablerIcons),
  MaterialModule
  ],
  declarations: [
    AppIconsComponent,
    AppSamplePageComponent
  ],
})
export class ExtraModule {}

