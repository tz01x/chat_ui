import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from  '@angular/material/toolbar'
import {MatIconModule} from  '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatButtonModule,
    // MatListModule,
    // MatDividerModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatProgressSpinnerModule,
    // MatSidenavModule,
    MatSnackBarModule,
    // MatChipsModule,
    // MatTabsModule,
  ]
})
export class MaterialModule { }
