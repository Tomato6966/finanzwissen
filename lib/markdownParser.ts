export const extractTitle = (markdown: string): string => {
  const title = markdown.match(/^# (.*$)/gm);
  return title ? title[0].replace('# ', '') : '';
};

export const extractAuthor = (markdown: string): string => {
  const author = markdown.match(/^###### (.*)/gm);
  return author ? author[0].replace('###### ', '') : '';
};

export const getPreviewExcludingTitleAndAuthor = (markdown: string, limit:number = 150): string => {
    const title = `# ${extractTitle(markdown)}`;
    const author = `###### ${extractAuthor(markdown)}`;
    const html = parseMarkdown(markdown.replace(title, '').replace(author, ''));
    return cleanHTMLFromAllTags(html).substring(0, limit);
};
export const cleanHTMLFromAllTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};


export const parseMarkdown = (markdown: string): string => {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

  // Remove author
  html = html.replace(/^###### (.*)/gm, '');

  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Handle lists properly - convert to temporary markers first
  html = html.replace(/^- (.*$)/gm, '<!--LIST_ITEM-->$1<!--/LIST_ITEM-->');
  html = html.replace(/^\d+\. (.*$)/gm, '<!--LIST_ITEM-->$1<!--/LIST_ITEM-->');

  // Convert list markers to proper HTML
  html = html.replace(/<!--LIST_ITEM-->(.*?)<!--\/LIST_ITEM-->/g, '<li>$1</li>');

  // Group consecutive li elements into ul tags
  html = html.replace(/(<li>.*?<\/li>)(?=\s*<li>)/g, '$1');
  html = html.replace(/(<li>.*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>');

  // Clean up multiple ul tags that should be one
  html = html.replace(/(<\/ul>)\s*(<ul>)/g, '$1$2');

  // Handle line breaks more intelligently
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  // Wrap in paragraphs, but be careful with lists and headers
  html = '<p>' + html + '</p>';

  // Remove paragraph tags around headers and lists
  html = html.replace(/<p>\s*(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><br><\/p>/g, '');

  return removeEmptyParagraphsAndNewlines(html);
};


// examples:
/*
<p>
<br></p>


<br>
<br>
*/

export const removeEmptyParagraphsAndNewlines = (html: string): string => {
  // First, fix the list structure - group consecutive li elements into proper ul/ol
  html = html.replace(/(<li>.*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>');
  html = html.replace(/(<ul>.*?<\/ul>)\s*(<ul>.*?<\/ul>)/g, '$1$2');

  // Remove empty paragraphs and excessive breaks
  html = html.replace(/<p>\s*<br>\s*<\/p>/gi, '');
  html = html.replace(/<p>\s*<\/p>/gi, '');
  html = html.replace(/<p>\s*<ul>/gi, '<ul>');
  html = html.replace(/<\/ul>\s*<\/p>/gi, '</ul>');

  // Clean up excessive line breaks
  html = html.replace(/(<br>\s*){2,}/gi, '<br>');
  html = html.replace(/<br>\s*<br>/gi, '<br>');

  // Remove breaks before and after headers
  html = html.replace(/<br>\s*(<h[1-6]>)/gi, '$1');
  html = html.replace(/(<\/h[1-6]>)\s*<br>/gi, '$1');

  // Remove breaks before and after lists
  html = html.replace(/<br>\s*(<ul>)/gi, '$1');
  html = html.replace(/(<\/ul>)\s*<br>/gi, '$1');

  // Remove breaks before and after list items
  html = html.replace(/<br>\s*(<li>)/gi, '$1');
  html = html.replace(/(<\/li>)\s*<br>/gi, '$1');

  // Clean up excessive whitespace
  html = html.replace(/\s+/g, ' ');
  html = html.replace(/>\s+</g, '><');

  // Remove leading/trailing breaks
  html = html.replace(/^<br>\s*/, '');
  html = html.replace(/\s*<br>$/, '');

  // Final cleanup of any remaining excessive breaks
  html = html.replace(/(<br>\s*){3,}/gi, '<br>');

  return html.trim();
};

// Test function to demonstrate the improved cleaning
export const testMarkdownParsing = (markdown: string): string => {
  const parsed = parseMarkdown(markdown);
  console.log('Original markdown:', markdown);
  console.log('Parsed HTML:', parsed);
  return parsed;
};
