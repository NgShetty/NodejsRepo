import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUnassignComponent } from './user-unassign.component';

describe('UserUnassignComponent', () => {
  let component: UserUnassignComponent;
  let fixture: ComponentFixture<UserUnassignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUnassignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUnassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
