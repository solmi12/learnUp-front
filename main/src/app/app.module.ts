
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';


//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { JwtModule } from '@auth0/angular-jwt';
// Vertical Layout
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { BrandingComponent } from './layouts/full/sidebar/branding.component';
import { AppNavItemComponent } from './layouts/full/sidebar/nav-item/nav-item.component';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { NgModel } from '@angular/forms';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DashbordUserComponent } from './dashbord-user/dashbord-user.component';
import { FullFormateurComponent } from './view-formateur/layouts/full/full.component';
import { SidebarFormateurComponent } from './view-formateur/layouts/full/sidebar/sidebar.component';
import { BlankFormateurComponent } from './view-formateur/layouts/blank/blank-formateur.component';
import { BrandingFormateurComponent } from './view-formateur/layouts/full/sidebar/branding.component';
import { AppNavItemFormateurComponent } from './view-formateur/layouts/full/sidebar/nav-item/nav-item-formateur.component';
import { HeaderFormateurComponent } from './view-formateur/layouts/full/header/header.component';
import { FullApprenantComponent } from './view-apprenant/layouts/full/full.component';
import { BlankApprenantComponent } from './view-apprenant/layouts/blank/blank-formateur.component';
import { SidebarApprenantComponent } from './view-apprenant/layouts/full/sidebar/sidebar.component';
import { HeaderApprenantComponent } from './view-apprenant/layouts/full/header/header.component';
import { BrandingApprenantComponent } from './view-apprenant/layouts/full/sidebar/branding.component';
import { AppNavItemApprenantComponent } from './view-apprenant/layouts/full/sidebar/nav-item/nav-item-formateur.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    FullFormateurComponent,
    FullApprenantComponent,
    BlankComponent,
    BlankApprenantComponent,
    BlankFormateurComponent,
    SidebarComponent,
    SidebarFormateurComponent,
    SidebarApprenantComponent,
    HeaderComponent,
    HeaderFormateurComponent,
    HeaderApprenantComponent,
    BrandingComponent,
    BrandingFormateurComponent,
    BrandingApprenantComponent,
    AppNavItemComponent,
    AppNavItemFormateurComponent,
    AppNavItemApprenantComponent,
 
  
       DashbordUserComponent,
 
  ],
  imports: [
    MatCardModule,
    MaterialModule,
    RouterModule.forRoot([]),
    AppRoutingModule,
    MatSelectModule,
    HttpClientModule,
   NgApexchartsModule,
   TablerIconsModule.pick(TablerIcons),
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-center' 
    }),

    TablerIconsModule.pick(TablerIcons),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      }
    }),
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
  ],
  providers:[
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}






