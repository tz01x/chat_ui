import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChatlistComponent } from './chatlist/chatlist.component'
import { MaterialModule } from './material/material.module';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatlistComponent,
    ChatViewComponent,
    HeaderComponent,
    ChatBubbleComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
