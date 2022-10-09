import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendsListItemComponent } from './add-friends-list-item.component';

describe('AddFriendsListItemComponent', () => {
  let component: AddFriendsListItemComponent;
  let fixture: ComponentFixture<AddFriendsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFriendsListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFriendsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
