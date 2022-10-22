import { Component, Input, OnInit } from '@angular/core';
import { RequestAcceptedStatus } from '../../interfaces';
import { AppStateService } from '../../services/app-state.service';
import { StoreService } from '../../services/store.service';
import {Subject, first, Observable, last, throttleTime} from 'rxjs'
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
@Component({
  standalone:true,
  imports:[
    CommonModule,
    MatChipsModule,
    MatButtonModule,
  ],
  selector: 'app-add-friends-list-item',
  templateUrl: './add-friends-list-item.component.html',
  styleUrls: ['./add-friends-list-item.component.scss']
})
export class AddFriendsListItemComponent implements OnInit {
  @Input() user:any;
  @Input() buttonText:string;
  @Input() actionFunction: ((user:any) => Observable<any>) | undefined;
  @Input() onComplectAction: ((user:any) => void) | undefined;
  @Input() onErrorAction: ((user:any,error:any) => void) | undefined;
  @Input() onNextAction: ((user:any,value:any) => void) | undefined;
  @Input() disableButtonAfterActionComplect = true;
  @Input() btnClass!:string;
  RequestAcceptedStatus=RequestAcceptedStatus
  disableAddBtn = false;
  private clickEventSubject = new Subject<boolean>();
  public clickEvent =  this.clickEventSubject.asObservable();


  constructor(
    public appState: AppStateService,
    private db:StoreService,
  ) { 
    this.buttonText = 'Add';
    

    this.clickEvent.pipe(throttleTime(1000))
    .subscribe(()=>{
      this.performAction();
    })
  }

  ngOnInit(): void {
    
  }

  buttonClickHandler(){
    this.clickEventSubject.next(true);
  }

  performAction(){
    this.user &&
    this.actionFunction && 
    this.actionFunction(this.user).subscribe({
      next:(value)=>{
        this.onNextAction&&this.onNextAction(this.user,value);
      },
      complete:()=>{
        this.onComplectAction&&this.onComplectAction(this.user);
        if(this.disableButtonAfterActionComplect){
          this.disableAddBtn = true;
        }
      },
      error:(err)=>{
        this.onErrorAction&&this.onErrorAction(this.user,err);
      }
    })
    // this.db.addFriends(this.appState.userDocID,this.user.uid).subscribe({
    //   complete:()=>{
    //     this.appState.showNonfiction(' Request send to '+this.user.displayName);
    //     this.disableAddBtn = true;
    //   },
    //   error:(err)=>{
    //     this.appState.showError('Error! Can not Added')
    //     console.error(err);
    //   }
    // });
  }

}
