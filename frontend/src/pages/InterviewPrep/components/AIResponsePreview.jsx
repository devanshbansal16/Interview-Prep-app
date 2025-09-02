import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const AIResponsePreview = ({ content, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gradient-to-r from-rose-200 to-pink-200 rounded animate-pulse w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Enhanced heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6 border-b-2 border-rose-200 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-4 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-700 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent mb-3 mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-600 bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent mb-2 mt-4">
              {children}
            </h4>
          ),
          
          // Enhanced paragraph styles
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4 text-base">
              {children}
            </p>
          ),
          
          // Enhanced strong/bold text
          strong: ({ children }) => (
            <strong className="font-bold text-rose-700 bg-gradient-to-r from-rose-100 to-pink-100 px-1 rounded">
              {children}
            </strong>
          ),
          
          // Enhanced emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-pink-600 font-medium">
              {children}
            </em>
          ),
          
          // Enhanced list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">
              {children}
            </li>
          ),
          
          // Enhanced blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-rose-300 bg-gradient-to-r from-rose-50 to-pink-50 pl-4 py-3 my-4 italic text-gray-700 rounded-r-lg">
              {children}
            </blockquote>
          ),
          
          // Enhanced code styles
          code: ({ children, className }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-lg shadow-lg border border-rose-200"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 px-2 py-1 rounded text-sm font-mono border border-rose-200">
                {children}
              </code>
            );
          },
          
          // Enhanced link styles
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-rose-600 hover:text-rose-800 underline decoration-rose-300 hover:decoration-rose-500 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          
          // Enhanced table styles
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-rose-200 rounded-lg overflow-hidden shadow-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-rose-100 hover:bg-rose-50 transition-colors duration-200">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-gray-700 border-r border-rose-100">
              {children}
            </td>
          ),
          
          // Enhanced horizontal rule
          hr: () => (
            <hr className="border-t-2 border-gradient-to-r from-rose-300 to-pink-300 my-6" />
          ),
          
          // Enhanced image styles
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg shadow-lg border-2 border-rose-200 max-w-full h-auto my-4"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AIResponsePreview;
