import { Component, ElementRef, EventEmitter, InjectionToken, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { IAcceptedFriend } from 'src/app/interfaces';
import { BehaviorSubject, Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserAvaterComponent } from '../user-avater/user-avatar.component';
import { MULTI_SELECT_SERVICE_TOKEN } from 'src/app/injection-tokens';



@Component({
  selector: 'app-multi-select-component',
  standalone: true,
  imports: [
    UserAvaterComponent,
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './multi-select-component.component.html',
  styleUrls: ['./multi-select-component.component.scss']
})
export class UserMultiSelectComponentComponent implements OnInit, OnDestroy {
  announcer = inject(LiveAnnouncer);
  _appState = inject(AppStateService);
  filterService = inject(MULTI_SELECT_SERVICE_TOKEN);
  @Input() fieldLabel !: string;
  @Output() selected_uid = new EventEmitter<string[]>();

  @ViewChild('friendsInput') fruitInput!: ElementRef<HTMLInputElement>;
  separatorKeysCodes = []
  inputCtrl = new FormControl('');

  unique_uid: string[] = [];
  items = new BehaviorSubject<IAcceptedFriend[]>([]);
  allItems = [];
  clearSelectionSubscriptions = this.filterService.clearSelection$.subscribe(() => {
    console.log('clear input selection');
    this.items.next([]);
    this.unique_uid.splice(0, this.unique_uid.length);
  });
  filteredItems: Observable<IAcceptedFriend[]> = this.inputCtrl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value) => {
      return this.filterService.filterBySearchTerm(value || '');
    }),
    catchError((err) => {
      this._appState.networkErrorHandler(err);
      return of([]);
    })
  );

  selected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as IAcceptedFriend;
    // check if uid exists in the selected uid list
    // if does not exist push the items and push to selected uid list
    if (this.unique_uid.indexOf(item.uid) == -1) {
      // this.items.push(item);
      this.items.next([...this.items.getValue(), item]);
      this.unique_uid.push(item.uid);
      this.selected_uid.next([...this.unique_uid]);
    }
    this.fruitInput.nativeElement.value = '';
    this.inputCtrl.setValue(null);
  }

  constructor() { }

  ngOnInit(): void {

  }

  remove(index: number): void {


    if (index >= 0) {
      const items = this.items.getValue();
      const item = items[index];
      items.splice(index, 1);
      this.unique_uid.splice(index, 1);
      this.items.next([...items]);
      this.selected_uid.next([...this.unique_uid]);

      this.announcer.announce(`Removed ${item.displayName}`);
    }
  }

  ngOnDestroy(): void {
    this.clearSelectionSubscriptions.unsubscribe();
  }
}
