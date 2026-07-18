"use client";

import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Lightweight markdown renderer for AI responses.
 * Handles: headers, bold, italic, code blocks, inline code, bullet lists, numbered lists.
 * Avoids adding react-markdown as a dependency.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;
  const key = () => keyCounter++;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        codeLines.push(lines[i] ?? "");
        i++;
      }
      elements.push(
        <pre
          key={key()}
          className="my-3 overflow-x-auto rounded-md bg-muted border border-border p-3 text-xs font-mono"
        >
          {lang && (
            <div className="text-2xs text-muted-foreground mb-1.5 font-sans">{lang}</div>
          )}
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key()} className="mt-4 mb-2 text-base font-bold text-foreground">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key()} className="mt-3 mb-1.5 text-sm font-semibold text-foreground">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key()} className="mt-2 mb-1 text-sm font-medium text-foreground">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.match(/^[-*+] /)) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i] ?? "").match(/^[-*+] /)) {
        listItems.push((lines[i] ?? "").slice(2));
        i++;
      }
      elements.push(
        <ul key={key()} className="my-2 space-y-1 pl-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const listItems: string[] = [];
      let num = 1;
      while (i < lines.length && (lines[i] ?? "").match(/^\d+\. /)) {
        listItems.push((lines[i] ?? "").replace(/^\d+\. /, ""));
        i++;
        num++;
      }
      elements.push(
        <ol key={key()} className="my-2 space-y-1 pl-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 font-medium text-primary">{idx + 1}.</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      elements.push(<hr key={key()} className="my-3 border-border" />);
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={key()} className="h-1" />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key()} className="text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return (
    <div className={cn("text-foreground", className)}>
      {elements}
    </div>
  );
}

/**
 * Renders inline markdown: **bold**, *italic*, `code`, and plain text.
 */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Split on bold, italic, and inline code patterns
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      parts.push(
        <strong key={k++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      parts.push(
        <em key={k++} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={k++}
          className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = match.index + token.length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
