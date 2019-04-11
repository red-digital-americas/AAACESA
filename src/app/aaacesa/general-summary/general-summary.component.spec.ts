import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSummaryComponent } from './general-summary.component';

describe('GeneralSummaryComponent', () => {
  let component: GeneralSummaryComponent;
  let fixture: ComponentFixture<GeneralSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
