import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UiComponentsRoutes } from './ui-components.routing';

import { AppChipsFormateurComponent } from './chips/chips.component';


import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from 'src/app/material.module';
import { AppMenuFormateurComponent } from './menu/menu.component';
import { AppBadgeFormateurComponent } from './badge/badge.component';
import { AppListsFormateurComponent } from './lists/lists.component';
import { AppTooltipsFormateurComponent } from './tooltips/tooltips.component';
import { ProfileFormateurComponent } from './profile-formateur/profile-formateur.component';
import { ListFormateurCoursComponent } from './list-formateur-cours/list-formateur-cours.component';
import { CourDetailsComponent } from './cour-details/cour-details.component';
import { ListQuestionsComponent } from './list-questions/list-questions.component';
import { ListeApprenantByCourComponent } from './liste-apprenant-by-cour/liste-apprenant-by-cour.component';
import { AddQuizComponent } from './add-quiz/add-quiz.component';

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
    AppBadgeFormateurComponent,
    AppChipsFormateurComponent,
    AppListsFormateurComponent,
    AppMenuFormateurComponent,
    AppTooltipsFormateurComponent,
    ProfileFormateurComponent,
    ListFormateurCoursComponent,
    CourDetailsComponent,
    ListQuestionsComponent,
    ListeApprenantByCourComponent,
    AddQuizComponent,
  ],
})
export class UicomponentsModule {}
