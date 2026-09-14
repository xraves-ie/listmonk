// Forked from https://github.com/fsegurai/codemirror-themes
// MIT License - Copyright (c) 2025 fsegurai

import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Xraves dark theme color definitions.
const background = '#111827';
const foreground = '#d9e3ea';
const caret = '#f9fafb';
const selection = '#3730a366';
const selectionMatch = '#818cf833';
const lineHighlight = '#ffffff0a';
const gutterBackground = '#1a1b1f';
const gutterForeground = '#cbd5e1';
const gutterActiveForeground = '#a5b4fc';
const keywordColor = '#818cf8';
const controlKeywordColor = '#a5b4fc';
const variableColor = '#fca5a5';
const classTypeColor = '#93c5fd';
const functionColor = '#fcd34d';
const numberColor = '#86efac';
const operatorColor = '#d9e3ea';
const regexpColor = '#a5b4fc';
const stringColor = '#86efac';
const commentColor = '#cbd5e1';
const linkColor = '#818cf8';
const invalidColor = '#f87171';

// Define the editor theme styles for the Xraves dark palette.
const xravesDarkTheme = /* @__PURE__ */EditorView.theme({
  '&': {
    color: foreground,
    backgroundColor: background,
    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
  },
  '.cm-content': {
    caretColor: caret,
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: caret,
  },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: selection,
  },
  '.cm-searchMatch': {
    backgroundColor: selectionMatch,
    outline: `1px solid ${lineHighlight}`,
  },
  '.cm-activeLine': {
    backgroundColor: lineHighlight,
  },
  '.cm-gutters': {
    backgroundColor: gutterBackground,
    color: gutterForeground,
  },
  '.cm-activeLineGutter': {
    color: gutterActiveForeground,
  },
}, { dark: true });
const xravesDarkHighlightStyle = /* @__PURE__ */HighlightStyle.define([
  {
    tag: [
      tags.keyword,
      tags.operatorKeyword,
      tags.modifier,
      tags.color,
      /* @__PURE__ */tags.constant(tags.name),
      /* @__PURE__ */tags.standard(tags.name),
      /* @__PURE__ */tags.standard(tags.tagName),
      /* @__PURE__ */tags.special(tags.brace),
      tags.atom,
      tags.bool,
      /* @__PURE__ */tags.special(tags.variableName),
    ],
    color: keywordColor,
  },
  { tag: [tags.moduleKeyword, tags.controlKeyword], color: controlKeywordColor },
  {
    tag: [
      tags.name,
      tags.deleted,
      tags.character,
      tags.macroName,
      tags.propertyName,
      tags.variableName,
      tags.labelName,
      /* @__PURE__ */tags.definition(tags.name),
    ],
    color: variableColor,
  },
  { tag: tags.heading, fontWeight: 'bold', color: variableColor },
  {
    tag: [
      tags.typeName,
      tags.className,
      tags.tagName,
      tags.number,
      tags.changed,
      tags.annotation,
      tags.self,
      tags.namespace,
    ],
    color: classTypeColor,
  },
  {
    tag: [/* @__PURE__ */tags.function(tags.variableName), /* @__PURE__ */tags.function(tags.propertyName)],
    color: functionColor,
  },
  { tag: [tags.number], color: numberColor },
  {
    tag: [tags.operator, tags.punctuation, tags.separator, tags.url, tags.escape, tags.regexp],
    color: operatorColor,
  },
  { tag: [tags.regexp], color: regexpColor },
  {
    tag: [/* @__PURE__ */tags.special(tags.string), tags.processingInstruction, tags.string, tags.inserted],
    color: stringColor,
  },
  { tag: [tags.meta, tags.comment], color: commentColor },
  { tag: tags.link, color: linkColor, textDecoration: 'underline' },
  { tag: tags.invalid, color: invalidColor },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
]);
// Extension to enable both the editor theme and its syntax highlighting.
const xravesDark = [
  xravesDarkTheme,
  /* @__PURE__ */syntaxHighlighting(xravesDarkHighlightStyle),
];

export { xravesDark, xravesDarkHighlightStyle, xravesDarkTheme };
