import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'; // CLI imports router 
import { AuthGuard } from './guards/auth.guard';
import { AppStateService } from './services/app-state.service';


const standAloneRoute: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)
    },
    {
        path:'home',
        loadChildren:()=>import('./home/home.routes').then(m=>m.HomeRoutes),
        canActivate: [AuthGuard]
        
        
    }
    ,

    { path: '', redirectTo: '/login', pathMatch: 'full' },

];

// sets up routes constant where you define your routes 
// configures NgModule imports and exports 
@NgModule({
    imports: [RouterModule.forRoot(standAloneRoute,{preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule],
    providers: [
        AppStateService
    ]
})
export class AppRoutingModule { }