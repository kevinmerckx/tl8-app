import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrSeparationComponent } from './or-separation.component';

describe('OrSeparationComponent', () => {
  let component: OrSeparationComponent;
  let fixture: ComponentFixture<OrSeparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrSeparationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrSeparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
