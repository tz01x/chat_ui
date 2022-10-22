import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login.component";
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { LoadingSpinerComponent } from "src/app/loading-spiner/loading-spiner.component";

const routes:Routes = [
    {
        path:'',
        // loadComponent:()=>import('./login.component').then(c=>c.LoginComponent)
        component:LoginComponent
    }
]

@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        CommonModule,
        LoadingSpinerComponent,
        RouterModule.forChild(routes),
    ],
    declarations:[
        LoginComponent,
    ]

})
export class LoginModule{}