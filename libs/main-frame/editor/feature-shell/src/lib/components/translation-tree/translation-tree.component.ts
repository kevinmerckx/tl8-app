import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import {
  faCaretDown,
  faCaretRight,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ModifiedTranslations } from '@tl8/private/interfaces';
import { getValueAtPath, uniqueStrings } from '@tl8/private/utils';
import { Observable } from 'rxjs';
import { MainFrameDataAccessService } from '@tl8/main-frame/editor/data-access-api';

export type Node = {
  chunk: string;
  path: string;
};

@Component({
  selector: 'tl8-translation-tree',
  templateUrl: './translation-tree.component.html',
  styleUrls: ['./translation-tree.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationTreeComponent {
  @Input() set roots(nodes: Node[]) {
    this._roots = sortNodes(nodes);
  }
  get roots() {
    return this._roots;
  }
  @Input() modifiedTranslations: ModifiedTranslations = [];
  @Input() selectedNode: string | undefined;
  @Output() selectedNodeChange = new EventEmitter<string | undefined>();

  itemSize = 28;

  icons = {
    collapsed: faCaretRight,
    expanded: faCaretDown,
    warning: faExclamationCircle,
  };
  private _roots: Node[] = [];
  private expandedNodes: Node['path'][] = [];

  constructor(private mainFrameDataAccessService: MainFrameDataAccessService) {}

  trackByNode: TrackByFunction<Node> = (_, item) => item.path;

  getChildren(node: Node): Node[] | undefined {
    const path = node.path.split('.');
    const children = sortNodes(
      uniqueStrings(
        this.modifiedTranslations.reduce((prev, { translations }) => {
          const value = getValueAtPath(translations, path);
          if (typeof value === 'object' && value) {
            return [...prev, ...Object.keys(value)];
          }
          return prev;
        }, [] as string[])
      ).map((key) => ({
        chunk: key,
        path: node.path + '.' + key,
      }))
    );
    if (children.length === 0) {
      return;
    }
    return children;
  }

  numberOfEmptyTranslationsUnderNode$(node: Node): Observable<number> {
    return this.mainFrameDataAccessService.numberOfEmptyTranslationsUnderNode$(
      node.path
    );
  }

  getTypedNode(node: unknown) {
    return node as Node;
  }

  toggleExpand(node: Node) {
    if (this.expandedNodes.includes(node.path)) {
      this.expandedNodes = this.expandedNodes.filter((n) => n !== node.path);
      return;
    }
    this.expandedNodes = [...this.expandedNodes, node.path];
  }

  expand(node: Node) {
    if (!this.getChildren(node)) {
      return;
    }
    if (this.expandedNodes.includes(node.path)) {
      return;
    }
    this.expandedNodes = [...this.expandedNodes, node.path];
  }

  isExpanded(node: Node) {
    return this.expandedNodes.includes(node.path);
  }

  selectNode(node: Node) {
    this.selectedNode = node.path;
    this.selectedNodeChange.emit(this.selectedNode);
  }

  isSelectedNode(node: Node) {
    return node.path === this.selectedNode;
  }
}

function sortNodes(nodes: Node[]) {
  const result = nodes.slice(0);
  result.sort((a, b) =>
    a.chunk.toLowerCase().localeCompare(b.chunk.toLowerCase())
  );
  return result;
}
