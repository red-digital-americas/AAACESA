import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AaacesaSalidasComponent } from './aaacesa-salidas.component';

describe('AaacesaSalidasComponent', () => {
  let component: AaacesaSalidasComponent;
  let fixture: ComponentFixture<AaacesaSalidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AaacesaSalidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AaacesaSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
