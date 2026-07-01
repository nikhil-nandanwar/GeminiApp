import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const NewMarkdown = ({ content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (error) {
            alert('Failed to copy code.');
        }
    };

    if (!content) {
        return <p>No content available.</p>;
    }

    return (
        <div className='markdown-render'>
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                children={content}
                components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');
                    const language = match ? match[1] : null;

                    return !inline && language ? (
                        <div className="relative mb-6 rounded-lg overflow-hidden bg-[#1e1e2f] shadow-md border border-[#2d2d3d]">
                            {/* Language Label */}
                            {/* <div className="absolute top-0 left-0 bg-[#2d2d3d] text-gray-300 text-sm font-medium py-1 px-3 rounded-tr-lg">
                                {language.toUpperCase()}
                            </div> */}
                            {/* Copy Button */}
                            <button
                                aria-label="Copy code to clipboard"
                                onClick={() => handleCopy(code)}
                                className={`absolute top-1.5 right-2 text-xs px-3 py-1 rounded bg-[#3b82f6] text-white hover:bg-[#2563eb] transition ${copied ? 'bg-green-500 hover:bg-green-600' : ''
                                    }`}
                            >
                                Copy
                            </button>
                            <SyntaxHighlighter
                                style={oneDark}
                                language={language}
                                PreTag="div"
                                {...props}
                                customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    paddingTop: '2rem',
                                    // background: 'transparent',
                                    border: '0.1em solid black'
                                }}
                            >
                                {code}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        />
        </div>
    );
};

export default React.memo(NewMarkdown);
