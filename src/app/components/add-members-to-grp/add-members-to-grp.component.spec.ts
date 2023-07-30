import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembersToGrpComponent } from './add-members-to-grp.component';

describe('AddMembersToGrpComponent', () => {
  let component: AddMembersToGrpComponent;
  let fixture: ComponentFixture<AddMembersToGrpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddMembersToGrpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMembersToGrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
