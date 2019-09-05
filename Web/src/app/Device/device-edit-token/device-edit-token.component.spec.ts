import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceEditTokenComponent } from './device-edit-token.component';

describe('DeviceEditTokenComponent', () => {
  let component: DeviceEditTokenComponent;
  let fixture: ComponentFixture<DeviceEditTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceEditTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceEditTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
