import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonOrderSummaryComponent } from './common-order-summary.component';

describe('CommonOrderSummaryComponent', () => {
  let component: CommonOrderSummaryComponent;
  let fixture: ComponentFixture<CommonOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonOrderSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
