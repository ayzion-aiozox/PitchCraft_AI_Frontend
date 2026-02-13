import { Routes } from '@angular/router';
import { PersonaGalleryComponent } from './persona-gallery.component';
import { PersonaForgeComponent } from './persona-forge.component';
import { PersonaDetailComponent } from './components/persona-detail/persona-detail.component';

export const PERSONA_FORGE_ROUTES: Routes = [
  { path: '', component: PersonaDetailComponent },
  { path: 'gallery', component: PersonaGalleryComponent },
  { path: 'detail', component: PersonaDetailComponent },
  { path: 'forge', component: PersonaForgeComponent },
];