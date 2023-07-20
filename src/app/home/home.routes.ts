import { Routes } from "@angular/router";
import { HomeComponent } from "./home.component";

export const HomeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home.component').then(c => c.HomeComponent),
        children: [
            {
                path: 'message',
                loadComponent: () => import('../chatlist/chatlist.component').then(c => c.ChatlistComponent)
            },
            {
                path: 'message/:chatRoomId/:roomId',
                loadComponent: () => import('../chat-view/chat-view.component').then(c => c.ChatViewComponent)
            },
            {
                path: 'add-friends',
                loadComponent: () => import('../add-friends/add-friends.component').then(c => c.AddFriendsComponent)

            },
            {
                path: 'all-friends',
                loadComponent: () => import('../all-firends/all-firends.component').then(c => c.AllFirendsComponent)
            },
            { path: '', redirectTo: '/home/message', pathMatch: 'full' },
        ]
    }
]
