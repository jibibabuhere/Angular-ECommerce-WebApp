import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStepperComponent } from './new-stepper.component';

describe('NewStepperComponent', () => {
  let component: NewStepperComponent;
  let fixture: ComponentFixture<NewStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
