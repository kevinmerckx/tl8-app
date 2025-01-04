import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrTreeViewModule } from '@clr/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainFrameEditorDataAccessApiModule } from '@tl8/main-frame/editor/data-access-api';
import { UiMessageModule } from '@tl8/ui/message';
import { UiUserBadgeModule } from '@tl8/ui/user-badge';
import { EditTranslationKeyComponent } from './components/edit-translation-key/edit-translation-key.component';
import { EditorComponent } from './components/editor/editor.component';
import { NodeSummaryComponent } from './components/node-summary/node-summary.component';
import { RawEditorTranslationsEditorComponent } from './components/raw-editor-translations-editor/raw-editor-translations-editor.component';
import { RawEditorComponent } from './components/raw-editor/raw-editor.component';
import { SearchTranslationsComponent } from './components/search-translations/search-translations.component';
import { SidebarLayoutComponent } from './components/sidebar-layout/sidebar-layout.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TranslationTreeComponent } from './components/translation-tree/translation-tree.component';
import { UrlInputComponent } from './components/url-input/url-input.component';
import { VisibleTranslationsEditorComponent } from './components/visible-translations-editor/visible-translations-editor.component';
import { WebviewWrapperComponent } from './components/webview-wrapper/webview-wrapper.component';
import { WysiwygComponent } from './components/wysiwyg/wysiwyg.component';
import { BrowserViewPlaceholderDirective } from './directives/browser-view-placeholder.directive';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    FontAwesomeModule,
    MainFrameEditorDataAccessApiModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditorComponent,
      },
    ]),
    UiMessageModule,
    ClrTreeViewModule,
    UiUserBadgeModule,
    ScrollingModule,
  ],
  declarations: [
    EditorComponent,
    ToolbarComponent,
    WebviewWrapperComponent,
    UrlInputComponent,
    VisibleTranslationsEditorComponent,
    EditTranslationKeyComponent,
    BrowserViewPlaceholderDirective,
    SearchTranslationsComponent,
    WysiwygComponent,
    RawEditorComponent,
    RawEditorTranslationsEditorComponent,
    TranslationTreeComponent,
    NodeSummaryComponent,
    SidebarLayoutComponent,
  ],
})
export class MainFrameEditorFeatureShellModule {}
