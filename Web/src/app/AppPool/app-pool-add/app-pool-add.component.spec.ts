import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPoolAddComponent } from './app-pool-add.component';

describe('AppPoolAddComponent', () => {
  let component: AppPoolAddComponent;
  let fixture: ComponentFixture<AppPoolAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPoolAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPoolAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
