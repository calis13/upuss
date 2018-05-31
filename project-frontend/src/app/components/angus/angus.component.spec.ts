import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngusComponent } from './angus.component';

describe('AngusComponent', () => {
  let component: AngusComponent;
  let fixture: ComponentFixture<AngusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
