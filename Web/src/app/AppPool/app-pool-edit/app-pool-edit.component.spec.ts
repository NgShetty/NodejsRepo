import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPoolEditComponent } from './app-pool-edit.component';

describe('AppPoolEditComponent', () => {
  let component: AppPoolEditComponent;
  let fixture: ComponentFixture<AppPoolEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPoolEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPoolEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
