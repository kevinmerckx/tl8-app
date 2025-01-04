import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';
import { of } from 'rxjs';
import { UrlInputComponent } from './url-input.component';

describe('UrlInputComponent', () => {
  let component: UrlInputComponent;
  let fixture: ComponentFixture<UrlInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlInputComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: MainFrameDataAccessService,
          useValue: {
            webviewUrl$: of(''),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
