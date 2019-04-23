import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrealertasComponent } from './prealertas.component';

describe('PrealertasComponent', () => {
  let component: PrealertasComponent;
  let fixture: ComponentFixture<PrealertasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrealertasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrealertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
