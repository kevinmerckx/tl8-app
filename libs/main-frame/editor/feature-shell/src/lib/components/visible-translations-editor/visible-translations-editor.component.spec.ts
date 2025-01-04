import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';

import { VisibleTranslationsEditorComponent } from './visible-translations-editor.component';

describe('VisibleTranslationsEditorComponent', () => {
  let component: VisibleTranslationsEditorComponent;
  let fixture: ComponentFixture<VisibleTranslationsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisibleTranslationsEditorComponent],
      providers: [
        {
          provide: MainFrameDataAccessService,
          useValue: {
            visibleKeyValues$: of([]),
            displayIncompatibleMessage$: of(false),
            displaySelectWebsite$: of(false),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleTranslationsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
