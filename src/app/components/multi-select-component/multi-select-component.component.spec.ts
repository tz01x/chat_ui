import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMultiSelectComponentComponent } from './multi-select-component.component';

describe('MultiSelectComponentComponent', () => {
  let component: UserMultiSelectComponentComponent;
  let fixture: ComponentFixture<UserMultiSelectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ UserMultiSelectComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMultiSelectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
