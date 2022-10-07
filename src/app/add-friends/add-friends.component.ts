import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.scss']
})
export class AddFriendsComponent implements OnInit {

  searchFormControl = new FormControl('');

  constructor(
    public appState:AppStateService,
    private router:Router,
    ) { }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigate(['/home'])
  }



}
