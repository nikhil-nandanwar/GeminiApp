import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Lazy load syntax highlighter for better performance
const SyntaxHighlighter = React.lazy(() => 
  import('react-syntax-highlighter').then(module => ({
    default: module.Prism
  }))
);

// Memoized copy button component
const CopyButton = React.memo(({ code, copied, onCopy }) => (
  <button
    aria-label="Copy code to clipboard"
    onClick={() => onCopy(code)}
    className={`absolute top-1.5 right-2 text-xs px-3 py-1 rounded-full border transition-all duration-200 ${
      copied ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50 hover:border-orange-200'
    }`}
  >
    {copied ? 'Copied!' : 'Copy'}
  </button>
));

CopyButton.displayName = 'CopyButton';

// Memoized code block component for better performance
const CodeBlock = React.memo(({ language, code, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState(null);

  // Load style asynchronously
  useEffect(() => {
    const loadStyle = async () => {
      try {
        const { oneDark } = await import('react-syntax-highlighter/dist/esm/styles/prism');
        setStyle(oneDark);
      } catch (error) {
        console.warn('Failed to load syntax highlighter style:', error);
      }
    };
    loadStyle();
  }, []);

  const handleCopy = useCallback(async (codeText) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Failed to copy code:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = codeText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        alert('Failed to copy code. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  }, []);

  const customStyle = useMemo(() => ({
    margin: 0,
    padding: '1rem',
    paddingTop: '2rem',
    border: '1px solid #e2e8f0',
    borderRadius: '1rem',
    background: '#f8fafc',
    fontSize: '0.875rem',
    lineHeight: '1.4'
  }), []);

  const shouldShowLineNumbers = useMemo(() => {
    return code.split('\n').length > 10;
  }, [code]);

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden bg-slate-50 shadow-[0_14px_30px_rgba(15,23,42,0.05)] border border-slate-200">
      <CopyButton code={code} copied={copied} onCopy={handleCopy} />
      <React.Suspense fallback={
        <div className="p-4 bg-slate-100 text-slate-600 font-mono text-sm whitespace-pre-wrap">
          {code}
        </div>
      }>
        <SyntaxHighlighter
          style={style || {}}
          language={language || 'text'}
          PreTag="div"
          customStyle={customStyle}
          showLineNumbers={shouldShowLineNumbers}
          wrapLines={true}
          wrapLongLines={true}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </React.Suspense>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

const NewMarkdown = ({ content }) => {
  // Memoized markdown components
  const components = useMemo(() => ({
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      const language = match ? match[1] : null;

      return !inline && language ? (
        <CodeBlock 
          language={language} 
          code={code} 
          className={className} 
          {...props} 
        />
      ) : (
        <code 
          className={`${className} px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-700 font-mono text-sm border border-orange-100`} 
          {...props}
        >
          {children}
        </code>
      );
    },
    // Optimize other markdown elements
    pre: ({ children, ...props }) => (
      <pre className="overflow-x-auto max-w-full" {...props}>
        {children}
      </pre>
    ),
    // Add proper styling for links
    a: ({ href, children, ...props }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors duration-200"
        {...props}
      >
        {children}
      </a>
    ),
    // Optimize table rendering
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-slate-200 rounded-lg" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="border border-slate-200 px-4 py-2 bg-slate-100 text-left font-semibold text-slate-700" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-slate-200 px-4 py-2 text-slate-600" {...props}>
        {children}
      </td>
    ),
    // Optimize blockquote styling
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-orange-400 pl-4 italic text-slate-600 my-4 bg-orange-50 py-2 rounded-r-lg" {...props}>
        {children}
      </blockquote>
    ),
    // Style headers
    h1: ({ children, ...props }) => (
      <h1 className="text-2xl font-bold mt-6 mb-4 text-slate-900 border-b border-slate-200 pb-2" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-xl font-semibold mt-5 mb-3 text-slate-900" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-medium mt-4 mb-2 text-slate-900" {...props}>
        {children}
      </h3>
    ),
    // Style lists
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside my-3 space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside my-3 space-y-1" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-slate-600" {...props}>
        {children}
      </li>
    ),
    // Style paragraphs
    p: ({ children, ...props }) => (
      <p className="my-3 text-slate-600 leading-relaxed" {...props}>
        {children}
      </p>
    )
  }), []);

  if (!content) {
    return <p className="text-slate-400">No content available.</p>;
  }

  return (
    <div className='markdown-render prose prose-invert max-w-none'>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default React.memo(NewMarkdown);
