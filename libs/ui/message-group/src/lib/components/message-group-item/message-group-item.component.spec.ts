import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageGroupItemComponent } from './message-group-item.component';

describe('MessageGroupItemComponent', () => {
  let component: MessageGroupItemComponent;
  let fixture: ComponentFixture<MessageGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageGroupItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
