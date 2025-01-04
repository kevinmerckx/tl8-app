import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawEditorTranslationsEditorComponent } from './raw-editor-translations-editor.component';

describe('RawEditorTranslationsEditorComponent', () => {
  let component: RawEditorTranslationsEditorComponent;
  let fixture: ComponentFixture<RawEditorTranslationsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RawEditorTranslationsEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RawEditorTranslationsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
