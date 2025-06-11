import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckClassComponent } from './check-class.component';

describe('CheckClassComponent', () => {
  let component: CheckClassComponent;
  let fixture: ComponentFixture<CheckClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckClassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
