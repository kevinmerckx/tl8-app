import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'tl8-search-translations',
  templateUrl: './search-translations.component.html',
  styleUrls: ['./search-translations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchTranslationsComponent {
  @Input() numberOfResults = 0;
  @Input() query = '';

  @Output() queryChange = new EventEmitter<string>();

  icons = {
    search: faSearch,
  };
}
