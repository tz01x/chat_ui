import { NgModule } from '@angular/core';
import { Routes, RouterModule, ROUTES } from '@angular/router'; // CLI imports router 
import { AppStateService } from './app-state.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { ChatlistComponent } from './chatlist/chatlist.component';


const standAloneRoute: Routes = [
    {path: 'login',component: LoginComponent},
    { path: 'message', component: ChatlistComponent },
    { path: 'message/:username', component: ChatViewComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },

];

// sets up routes constant where you define your routes 
// configures NgModule imports and exports 
@NgModule({
    imports: [RouterModule.forRoot(standAloneRoute)],
    exports: [RouterModule],
    providers: [
        // {
        //     provide: ROUTES,
        //     deps: [AppStateService],
        //     useFactory: (appState: AppStateService) => {
        //         debugger;
        //         let routes: Routes = [];
        //         if (appState.isViewPortLarge) {
        //             routes = [
        //                 {
        //                     path: 'message', component: ChatlistComponent,

        //                     children: [

        //                         { path: ':username', component: ChatViewComponent },
        //                     ]
        //                 },
        //             ]

        //         } else {


        //             routes = [
        //                 { path: 'message', component: ChatlistComponent },
        //                 { path: 'message/:username', component: ChatViewComponent },
        //             ]
        //         }

        //         return [
        //             ...routes,
        //             ...standAloneRoute,
        //         ]
        //     },
        //     multi: true // add new provider instate of over-writing

        // }
    ]
})
export class AppRoutingModule { }