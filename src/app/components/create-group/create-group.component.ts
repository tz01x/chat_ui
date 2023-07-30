import { Component, OnDestroy, OnInit } from '@angular/core';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { EMPTY, Observable, Subject, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap, distinctUntilChanged, tap, ignoreElements, catchError, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AppStateService } from 'src/app/services/app-state.service';
import { StoreService } from 'src/app/services/store.service';
import { IAcceptedFriend, IChatRoom } from 'src/app/interfaces';
import { UserAvaterComponent } from '../user-avater/user-avatar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { minidenticon } from 'minidenticons'

@Component({
  standalone: true,
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    UserAvaterComponent,
    MatInputModule,
  ],
})
export class CreateGroupComponent implements OnInit, OnDestroy {

  announcer = inject(LiveAnnouncer);
  _appState = inject(AppStateService);
  _db = inject(StoreService);
  _router = inject(Router);

  @ViewChild('friendsInput') fruitInput!: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [];
  inputCtrl = new FormControl('');
  groupNameCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  photoUrl!: string;
  photoUrl$ = this.groupNameCtrl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    map((value) => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(value || '', 90, 40))),
    tap((value) => { this.photoUrl = value })
  );
  items: IAcceptedFriend[] = [];
  unique_uid: string[] = [];
  allItems = [];
  filteredItems: Observable<IAcceptedFriend[]> = this.inputCtrl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value) => {
      return this._db.getAllFriends(this._appState.userDocID || '', value || '', 20);
    }),
    catchError((err) => {
      this._appState.networkErrorHandler(err);
      return of([]);
    })
  );
  destroy$ = new Subject<boolean>();







  constructor() {
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
  }
  remove(index: number): void {


    if (index >= 0) {
      const item = this.items[index];
      this.items.splice(index, 1);

      this.announcer.announce(`Removed ${item.displayName}`);
    }
  }



  selected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as IAcceptedFriend;
    // check if uid exists in the unique_uid list
    // if does not exist push the items and push to unique_uid list
    if (this.unique_uid.indexOf(item.uid) == -1) {
      this.items.push(item);
      this.unique_uid.push(item.uid);
    }
    this.fruitInput.nativeElement.value = '';
    this.inputCtrl.setValue(null);
  }

  create() {

    if (this.groupNameCtrl.invalid || this.unique_uid.length < 1) {
      this._appState.showErrorNotification('Can not create group because of invalid information')
      return;
    }
    
    const data = {
      primary_uid: this._appState.userDocID,
      group_name: this.groupNameCtrl.value,
      photoUrl: this.photoUrl,
      added_user_uids: this.unique_uid
    }

    const createDataStream$ = this._db.create_group(data)
    .pipe(
      takeUntil(this.destroy$),
      catchError((err) => {
        this._appState.networkErrorHandler(err);
        return EMPTY;
      })
  ).subscribe((data) => {
    this._appState.showNonfiction('Group created successfully');
    this._router.navigate(['/home/message',data.id,data.room_id]);
  });

  }

  cancel_and_close(event: Event) {
    this.items = [];
    this.unique_uid = [];
    this.groupNameCtrl.setValue(null);
    this.inputCtrl.setValue(null);
    event.preventDefault();
    this._router.navigate(['/home/message']);
  }

}
