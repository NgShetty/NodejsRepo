import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPoolTenantsComponent } from './app-pool-tenants.component';

describe('AppPoolTenantsComponent', () => {
  let component: AppPoolTenantsComponent;
  let fixture: ComponentFixture<AppPoolTenantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppPoolTenantsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPoolTenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
