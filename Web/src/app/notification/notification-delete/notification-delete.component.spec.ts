import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDeleteComponent } from './notification-delete.component';

describe('NotificationDeleteComponent', () => {
  let component: NotificationDeleteComponent;
  let fixture: ComponentFixture<NotificationDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
