import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from  '@angular/material/toolbar'
import {MatIconModule} from  '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
  ]
})
export class MaterialModule { }
