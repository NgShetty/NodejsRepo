import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPoolDeleteComponent } from './app-pool-delete.component';

describe('AppPoolDeleteComponent', () => {
  let component: AppPoolDeleteComponent;
  let fixture: ComponentFixture<AppPoolDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPoolDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPoolDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
