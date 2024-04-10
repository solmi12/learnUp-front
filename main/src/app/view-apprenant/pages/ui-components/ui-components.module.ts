import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UiComponentsRoutes } from './ui-components.routing';

// ui components
import { AppBadgeComponent } from './badge/badge.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from 'src/app/material.module';
import { AppChipsApprenantComponent } from './chips/chips.component';
import { MesApprentissagesComponent } from './mes-apprentissages/mes-apprentissages.component';
import { ListSouhaitComponent } from './list-souhait/list-souhait.component';

@NgModule({
  imports: [
 
    CommonModule,
    RouterModule.forChild(UiComponentsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule
  ],
  declarations: [
    AppBadgeComponent,
    AppChipsApprenantComponent,
    AppListsComponent,
    AppMenuComponent,
    AppTooltipsComponent,
    MesApprentissagesComponent,
    ListSouhaitComponent,
  ],
})
export class UicomponentsModule {}
