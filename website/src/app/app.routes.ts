import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { PasswordGeneratorComponent } from './pages/password-generator.component';
import { GuidesComponent } from './pages/guides.component';
import { PrivacyComponent } from './pages/privacy.component';
import { AdminComponent } from './pages/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tools/password-generator', component: PasswordGeneratorComponent },
  { path: 'guides', component: GuidesComponent },
  { path: 'guides/:slug', component: GuidesComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];
