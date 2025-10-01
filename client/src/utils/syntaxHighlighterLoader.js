// Optimized syntax highlighter with dynamic imports for better code splitting
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// Only import the style we need
let highlighterStyle = null;

// Dynamically import style only when needed
export const loadHighlighterStyle = async () => {
  if (!highlighterStyle) {
    const { oneDark } = await import('react-syntax-highlighter/dist/esm/styles/prism');
    highlighterStyle = oneDark;
  }
  return highlighterStyle;
};

// Pre-load commonly used languages for better performance
const languageLoaders = {
  javascript: () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  python: () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
  jsx: () => import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
  typescript: () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  css: () => import('react-syntax-highlighter/dist/esm/languages/prism/css'),
  html: () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
  json: () => import('react-syntax-highlighter/dist/esm/languages/prism/json'),
  bash: () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
  sql: () => import('react-syntax-highlighter/dist/esm/languages/prism/sql'),
  markdown: () => import('react-syntax-highlighter/dist/esm/languages/prism/markdown')
};

// Register languages as needed
export const registerLanguage = async (language) => {
  if (languageLoaders[language] && !SyntaxHighlighter.supportedLanguages?.includes(language)) {
    try {
      const languageModule = await languageLoaders[language]();
      SyntaxHighlighter.registerLanguage(language, languageModule.default);
    } catch (error) {
      console.warn(`Failed to load language: ${language}`, error);
    }
  }
};

// Pre-register common languages
export const preloadCommonLanguages = async () => {
  const commonLanguages = ['javascript', 'python', 'jsx', 'typescript', 'css', 'html', 'json'];
  await Promise.all(commonLanguages.map(registerLanguage));
};

export { SyntaxHighlighter };