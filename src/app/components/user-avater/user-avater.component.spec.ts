import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvaterComponent } from './user-avatar.component';

describe('UserAvaterComponent', () => {
  let component: UserAvaterComponent;
  let fixture: ComponentFixture<UserAvaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAvaterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAvaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
