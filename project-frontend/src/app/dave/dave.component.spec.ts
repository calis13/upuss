import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaveComponent } from './dave.component';

describe('DaveComponent', () => {
  let component: DaveComponent;
  let fixture: ComponentFixture<DaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
