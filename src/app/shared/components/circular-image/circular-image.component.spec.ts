import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularImageComponent } from './circular-image.component';

describe('CircularImageComponent', () => {
  let component: CircularImageComponent;
  let fixture: ComponentFixture<CircularImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircularImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
