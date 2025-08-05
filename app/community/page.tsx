'use client';

import { Check, Share2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import MarkdownFileCard from "@/components/MarkdownFileCard";
import MarkdownSearch from "@/components/MarkdownSearch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPreviewExcludingTitleAndAuthor, parseMarkdown } from "@/lib/markdownParser";
import { MarkdownContent, useMarkdownService } from "@/lib/markdownService";

import { Button } from "../../components/ui/button";

// Separate component to handle search params
const CommunityContent = () => {
  const { files, loading, error, searchFiles, getFileById } = useMarkdownService();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalContent, setModalContent] = useState<MarkdownContent | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  // Memoized filtered files to prevent infinite loops
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) {
      return files;
    }
    return searchFiles(searchQuery);
  }, [files, searchQuery, searchFiles]);

  // Handle modal content when slug changes
  useEffect(() => {
    const fetchModalContent = async () => {
      if (!slug) {
        setModalContent(null);
        return;
      }

      setModalLoading(true);
      setModalError(null);

      try {
        const fileContent = await getFileById(slug);
        if (fileContent) {
          setModalContent(fileContent);
        } else {
          setModalError('File not found');
        }
      } catch (error) {
        console.error('Error fetching markdown content:', error);
        setModalError('Failed to load content');
      } finally {
        setModalLoading(false);
      }
    };

    fetchModalContent();
  }, [slug, getFileById]);

  const handleShare = () => {
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/community?slug=${slug}`;
    if (navigator.share) {
      navigator.share({
        title: parseMarkdown(modalContent?.content || ''),
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeModal = () => {
    // Update URL to remove slug parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('slug');
    window.history.replaceState({}, '', url.toString());
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-muted-foreground">
          Loading files...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-25vh)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
          Community Knowledge Base
        </h1>
        <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-3xl mx-auto">
          Explore and contribute to our community-driven financial education resources.
        </p>
      </div>

      <MarkdownSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFiles.map((file) => (
          <MarkdownFileCard
            key={file.id}
            id={file.id}
            title={file.extractedTitle}
            author={file.author}
            preview={getPreviewExcludingTitleAndAuthor(file.content, 150)}
            path={`/community?slug=${file.id}`}
          />
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-muted-foreground">
            No files found matching your search.
          </p>
        </div>
      )}

      {/* Modal */}
      {slug && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p className="font-bold text-gray-900 dark:text-foreground">{modalContent?.id || "loading.md ..."}</p>
                <div className="flex flex-wrap items-center justify-end gap-4">
                    <Button onClick={handleShare} variant="default" className="flex items-center gap-2">
                        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Share'}
                    </Button>
                    <Button onClick={closeModal} variant="outline" className="flex items-center gap-2">
                        <X className="h-2 w-2" />
                        Back to Files
                    </Button>
                </div>
              </div>


              {modalLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-muted-foreground">
                    Loading content...
                  </p>
                </div>
              )}

              {modalError && (
                <div className="text-center py-8">
                  <p className="text-red-500 dark:text-red-400">
                    {modalError}
                  </p>
                </div>
              )}

              {modalContent && !modalLoading && !modalError && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-muted-foreground">
                          {modalContent.author && (
                            <span>By {modalContent.author}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div
                        className="markdown-content prose prose-gray dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(modalContent.content)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading fallback component
const CommunityLoading = () => (
  <div className="text-center py-8">
    <p className="text-gray-500 dark:text-muted-foreground">
      Loading community content...
    </p>
  </div>
);

const MarkdownPage = () => {
  return (
    <Suspense fallback={<CommunityLoading />}>
      <CommunityContent />
    </Suspense>
  );
};

export default MarkdownPage;
