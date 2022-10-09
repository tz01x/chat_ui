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
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { HomeComponent } from './home/home.component';
import { LoadingSpinerComponent } from './loading-spiner/loading-spiner.component';
import { AddFriendsComponent } from './add-friends/add-friends.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ContentRefDirective } from './content-ref.directive';
import { NotificationComponent } from './components/notification/notification.component';
import { HttpClientModule } from '@angular/common/http';
import { AddFriendsListItemComponent } from './components/add-friends-list-item/add-friends-list-item.component';
import { AllFirendsComponent } from './all-firends/all-firends.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatlistComponent,
    ChatViewComponent,
    HeaderComponent,
    ChatBubbleComponent,
    LoginComponent,
    HomeComponent,
    LoadingSpinerComponent,
    AddFriendsComponent,
    ContentRefDirective,
    NotificationComponent,
    AddFriendsListItemComponent,
    AllFirendsComponent,
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp({ ...environment.firebase })),
    provideFirestore(() => getFirestore()),
    provideAuth(()=>getAuth()),
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
