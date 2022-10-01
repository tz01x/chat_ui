import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChatlistComponent } from './chatlist/chatlist.component'
import { MaterialModule } from './material/material.module';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
@NgModule({
  declarations: [
    AppComponent,
    ChatlistComponent,
    ChatViewComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
