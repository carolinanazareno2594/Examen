import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DbzComponent } from './pages/dbz/dbz.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { CocktailsComponent } from './pages/cocktails/cocktails.component'; // Este es el nombre del componente de cocteles en inglés
import { AuthGuard } from './guard/auth.guard'; // Mantener la guarda de autenticación
import { MyApiRoutingModule } from './pages/my-api/my-api-routing.module'; // Importa el módulo de rutas de my-api

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dbz', component: DbzComponent },
  { path: 'pokemon', component: PokemonComponent },
  { path: 'cocteles', component: CocktailsComponent },
  {
    path: 'my-api',
    loadChildren: () => import('./pages/my-api/my-api.module').then(m => m.MyApiModule),
    canActivate: [AuthGuard] // Se añade AuthGuard para proteger esta ruta
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MyApiRoutingModule], // Mantenemos la configuración del módulo de rutas
  exports: [RouterModule]
})
export class AppRoutingModule { }
