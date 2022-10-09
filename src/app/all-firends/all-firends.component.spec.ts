import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFirendsComponent } from './all-firends.component';

describe('AllFirendsComponent', () => {
  let component: AllFirendsComponent;
  let fixture: ComponentFixture<AllFirendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllFirendsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllFirendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
