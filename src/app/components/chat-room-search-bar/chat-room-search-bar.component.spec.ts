import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomSearchBarComponent } from './chat-room-search-bar.component';

describe('ChatRoomSearchBarComponent', () => {
  let component: ChatRoomSearchBarComponent;
  let fixture: ComponentFixture<ChatRoomSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRoomSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRoomSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
