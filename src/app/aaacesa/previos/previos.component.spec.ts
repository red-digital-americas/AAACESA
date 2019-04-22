import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviosComponent } from './previos.component';

describe('PreviosComponent', () => {
  let component: PreviosComponent;
  let fixture: ComponentFixture<PreviosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
