import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * LessonContent — renders Markdown lesson content with a consistent,
 * editorial template matching the dark forest theme of LessonPage.
 *
 * Supported Markdown:
 *  - # H1  ## H2  ### H3  #### H4
 *  - **bold**  *italic*  ~~strikethrough~~
 *  - > blockquote (great for Quranic verses / hadith citations)
 *  - - lists  1. ordered lists
 *  - `inline code`  ```code blocks```
 *  - ---  (horizontal rule)
 *  - [link](url)
 *  - Tables (via remark-gfm)
 */

interface LessonContentProps {
  content: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  return (
    <div className="lesson-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* ── Headings ─────────────────────────────────────────── */
          h1: ({ children }) => (
            <h1 className="font-display text-2xl font-bold text-gold-200 mt-10 mb-4 pb-2 border-b border-gold-400/20">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-xl font-bold text-gold-300 mt-8 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-gold-400 rounded-full inline-block shrink-0" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-gold-200/90 mt-6 mb-2 uppercase tracking-wider text-xs">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-gold-100/70 mt-4 mb-2 italic">
              {children}
            </h4>
          ),

          /* ── Paragraph ─────────────────────────────────────────── */
          p: ({ children }) => (
            <p className="text-gold-100/75 leading-relaxed mb-4 text-[0.95rem]">
              {children}
            </p>
          ),

          /* ── Blockquote — ideal for Quranic verses / hadith ────── */
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-gold-400 pl-5 pr-3 py-3 bg-gold-400/8 rounded-r-xl">
              <div className="text-gold-300/90 italic leading-relaxed text-[0.95rem]">
                {children}
              </div>
            </blockquote>
          ),

          /* ── Lists ─────────────────────────────────────────────── */
          ul: ({ children }) => (
            <ul className="space-y-1.5 mb-4 pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 mb-4 pl-2 list-none counter-reset-[item]">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            const isOrdered = props.node?.parent?.type === 'list' &&
              (props.node?.parent as any)?.ordered === true;
            return (
              <li className="flex items-start gap-2.5 text-gold-100/75 text-[0.95rem] leading-relaxed">
                {isOrdered ? (
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gold-400/15 text-gold-400 text-xs font-bold flex items-center justify-center">
                    {(props as any).index !== undefined ? (props as any).index + 1 : '·'}
                  </span>
                ) : (
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                )}
                <span>{children}</span>
              </li>
            );
          },

          /* ── Inline code ───────────────────────────────────────── */
          code: ({ inline, children }: any) =>
            inline ? (
              <code className="px-1.5 py-0.5 bg-forest-800 text-gold-300 text-sm rounded font-mono border border-gold-400/15">
                {children}
              </code>
            ) : (
              <code className="block bg-forest-900 border border-gold-400/10 rounded-xl p-4 text-gold-200/80 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">
                {children}
              </code>
            ),

          /* ── Code block wrapper ─────────────────────────────────── */
          pre: ({ children }) => (
            <pre className="mb-4 rounded-xl overflow-hidden">
              {children}
            </pre>
          ),

          /* ── Horizontal rule ─────────────────────────────────── */
          hr: () => (
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gold-400/15" />
              <span className="text-gold-400/40 text-xs">✦</span>
              <div className="flex-1 h-px bg-gold-400/15" />
            </div>
          ),

          /* ── Strong / Em ─────────────────────────────────────── */
          strong: ({ children }) => (
            <strong className="font-bold text-gold-200">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gold-300/90">{children}</em>
          ),

          /* ── Links ───────────────────────────────────────────── */
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 underline underline-offset-2 hover:text-gold-300 transition-colors"
            >
              {children}
            </a>
          ),

          /* ── Table (remark-gfm) ──────────────────────────────── */
          table: ({ children }) => (
            <div className="mb-6 overflow-x-auto rounded-xl border border-gold-400/15">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-forest-800 text-gold-300 text-xs uppercase tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gold-400/10 text-gold-100/70">
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default LessonContent;
