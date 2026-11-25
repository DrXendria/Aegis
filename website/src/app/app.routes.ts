import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { PasswordGeneratorComponent } from './pages/password-generator.component';
import { GuidesComponent } from './pages/guides.component';
import { PrivacyComponent } from './pages/privacy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tools/password-generator', component: PasswordGeneratorComponent },
  { path: 'guides', component: GuidesComponent },
  { path: 'guides/:slug', component: GuidesComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: '' },
];
