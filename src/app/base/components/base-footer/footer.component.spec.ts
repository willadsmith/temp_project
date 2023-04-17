import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: BaseFooterComponent;
  let fixture: ComponentFixture<BaseFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
