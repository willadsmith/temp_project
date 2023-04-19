import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: BaseSidebarComponent;
  let fixture: ComponentFixture<BaseSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
