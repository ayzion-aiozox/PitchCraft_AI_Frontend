import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Link2Off,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Pilcrow,
  TextQuote,
  Code,
  Undo2,
  Redo2,
  RemoveFormatting,
} from 'lucide-angular';

export interface RichEditorTool {
  id: string;
  icon: typeof Bold;
  /** `document.execCommand` command; `__link__` opens URL prompt */
  command: string;
  queryCommand?: string;
  /** Second argument to execCommand (e.g. `<h2>` for formatBlock) */
  value?: string;
  /** Compare with `queryCommandValue('formatBlock')` for active state (e.g. `h2`, `blockquote`) */
  queryValue?: string;
  /** Never show active state (undo, redo, link, clear) */
  noActive?: boolean;
}

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.scss'],
})
export class RichEditorComponent implements AfterViewInit, OnChanges {
  @Input() content = '';
  @Input() placeholder = 'Describe what your product does, its core technology, and primary use cases...';

  @Output() contentChange = new EventEmitter<string>();

  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  /** Grouped with separators: history → inline → blocks → lists → insert → clear */
  readonly toolbarItems: Array<RichEditorTool | 'sep'> = [
    { id: 'undo', icon: Undo2, command: 'undo', noActive: true },
    { id: 'redo', icon: Redo2, command: 'redo', noActive: true },
    'sep',
    { id: 'bold', icon: Bold, command: 'bold', queryCommand: 'bold' },
    { id: 'italic', icon: Italic, command: 'italic', queryCommand: 'italic' },
    { id: 'underline', icon: Underline, command: 'underline', queryCommand: 'underline' },
    { id: 'strike', icon: Strikethrough, command: 'strikeThrough', queryCommand: 'strikeThrough' },
    'sep',
    { id: 'h2', icon: Heading2, command: 'formatBlock', value: '<h2>', queryCommand: 'formatBlock', queryValue: 'h2' },
    { id: 'h3', icon: Heading3, command: 'formatBlock', value: '<h3>', queryCommand: 'formatBlock', queryValue: 'h3' },
    { id: 'p', icon: Pilcrow, command: 'formatBlock', value: '<p>', queryCommand: 'formatBlock', queryValue: 'p' },
    { id: 'quote', icon: TextQuote, command: 'formatBlock', value: '<blockquote>', queryCommand: 'formatBlock', queryValue: 'blockquote' },
    { id: 'code', icon: Code, command: 'formatBlock', value: '<pre>', queryCommand: 'formatBlock', queryValue: 'pre' },
    'sep',
    { id: 'ul', icon: List, command: 'insertUnorderedList', queryCommand: 'insertUnorderedList' },
    { id: 'ol', icon: ListOrdered, command: 'insertOrderedList', queryCommand: 'insertOrderedList' },
    'sep',
    { id: 'link', icon: Link, command: '__link__', noActive: true },
    { id: 'unlink', icon: Link2Off, command: 'unlink', noActive: true },
    'sep',
    { id: 'clear', icon: RemoveFormatting, command: 'removeFormat', noActive: true },
  ];

  private readonly toolTitles: Record<string, string> = {
    undo: 'Undo',
    redo: 'Redo',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strike: 'Strikethrough',
    h2: 'Heading 2',
    h3: 'Heading 3',
    p: 'Paragraph',
    quote: 'Quote',
    code: 'Code block',
    ul: 'Bullet list',
    ol: 'Numbered list',
    link: 'Insert link',
    unlink: 'Remove link',
    clear: 'Clear formatting',
  };

  constructor(private readonly cdr: ChangeDetectorRef) {}

  itemTitle(tool: RichEditorTool): string {
    return this.toolTitles[tool.id] ?? tool.id;
  }

  ngAfterViewInit(): void {
    this.syncFromInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.syncFromInput();
    }
  }

  private syncFromInput(): void {
    const el = this.editorRef?.nativeElement;
    if (!el) return;
    if (document.activeElement === el) return;
    const v = this.content ?? '';
    if (el.innerHTML !== v) {
      el.innerHTML = v;
    }
    this.cdr.markForCheck();
  }

  @HostListener('document:selectionchange')
  onSelectionChange(): void {
    const el = this.editorRef?.nativeElement;
    if (el && el.contains(document.getSelection()?.anchorNode ?? null)) {
      this.cdr.markForCheck();
    }
  }

  isActive(tool: RichEditorTool): boolean {
    if (tool.noActive) return false;
    const el = this.editorRef?.nativeElement;
    if (!el || !el.contains(document.getSelection()?.anchorNode ?? null)) {
      return false;
    }
    try {
      if (tool.command === 'formatBlock' && tool.queryValue) {
        const cur = (document.queryCommandValue('formatBlock') || '').replace(/[<>]/g, '').toLowerCase();
        return cur === tool.queryValue.toLowerCase();
      }
      return document.queryCommandState(tool.queryCommand || tool.command);
    } catch {
      return false;
    }
  }

  onToolbarMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }

  applyFormat(tool: RichEditorTool): void {
    const el = this.editorRef?.nativeElement;
    if (!el) return;
    el.focus();

    if (tool.command === '__link__') {
      const url = typeof window !== 'undefined' ? window.prompt('Link URL', 'https://') : null;
      if (url?.trim()) {
        document.execCommand('createLink', false, url.trim());
      }
    } else if (tool.value !== undefined) {
      document.execCommand(tool.command, false, tool.value);
    } else {
      document.execCommand(tool.command, false);
    }

    this.emitContent();
    this.cdr.markForCheck();
  }

  onEditorInput(): void {
    this.emitContent();
  }

  private emitContent(): void {
    const el = this.editorRef?.nativeElement;
    if (!el) return;
    let html = el.innerHTML;
    if (html === '<br>' || html === '<div><br></div>' || html === '<p><br></p>') {
      html = '';
    }
    this.contentChange.emit(html);
  }

  get isEmpty(): boolean {
    const el = this.editorRef?.nativeElement;
    if (!el) return true;
    const t = el.innerText?.replace(/\u00a0/g, ' ').trim() ?? '';
    return t.length === 0;
  }
}
