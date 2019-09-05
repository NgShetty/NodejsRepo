import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPoolViewComponent } from './app-pool-view.component';

describe('AppPoolViewComponent', () => {
  let component: AppPoolViewComponent;
  let fixture: ComponentFixture<AppPoolViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPoolViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPoolViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
