import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonoComponent } from './abandono.component';

describe('AbandonoComponent', () => {
  let component: AbandonoComponent;
  let fixture: ComponentFixture<AbandonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbandonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
