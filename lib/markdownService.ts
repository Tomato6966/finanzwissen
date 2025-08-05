'use client';

import { useCallback, useEffect, useMemo, useState } from "react";

import { extractAuthor, extractTitle } from "./markdownParser";

export interface MarkdownContent {
    id: string;
    author: string;
    extractedTitle: string;
    content: string;
}

const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        return '';
    }
    return `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`;
};

export const useMarkdownService = () => {
    const [files, setFiles] = useState<MarkdownContent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const baseUrl = getBaseUrl();
            if (!baseUrl) {
                console.warn('Base URL not available, skipping fetch');
                setFiles([]);
                return;
            }

            const response = await fetch(`${baseUrl}/community_docs/all_doc_ids.txt`);
            if (!response.ok) {
                throw new Error('Failed to fetch metadata');
            }

            const allFileNames = await response.text();
            console.log(allFileNames);

            const results = await Promise.all(
                allFileNames
                    .split("\n")
                    .filter((f) => f.endsWith(".md"))
                    .map(async (fileId) => {
                        try {
                            const fileResponse = await fetch(`${baseUrl}/community_docs/${fileId}`);
                            if (!fileResponse.ok) {
                                return null;
                            }
                            const content = await fileResponse.text();

                            return {
                                id: fileId,
                                extractedTitle: extractTitle(content) || fileId,
                                content: content,
                                author: extractAuthor(content) || 'unknown',
                            };
                        } catch (error) {
                            console.error(`Error fetching file ${fileId}:`, error);
                            return null;
                        }
                    })
            );

            const filteredResults = results.filter((f) => f !== null) as MarkdownContent[];
            setFiles(filteredResults);
        } catch (error) {
            console.error('Error fetching markdown files:', error);
            setError('Failed to fetch files');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch files on mount
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const getFileById = useCallback(async (id: string): Promise<MarkdownContent | null> => {
        try {
            const baseUrl = getBaseUrl();
            if (!baseUrl) {
                console.warn('Base URL not available, skipping fetch');
                return null;
            }

            const response = await fetch(`${baseUrl}/community_docs/${id}`);
            if (!response.ok) {
                return null;
            }

            const content = await response.text();
            const file = files.find(file => file.id === id);

            if (!file) {
                return null;
            }

            return {
                ...file,
                extractedTitle: extractTitle(content) || file.id,
                author: extractAuthor(content) || file.author,
                content: content
            };
        } catch (error) {
            console.error('Error fetching markdown content:', error);
            return null;
        }
    }, [files]);

    // Improved search with basic fuzzy matching (Levenshtein distance) for title and id, and substring for content.
    // This is lightweight and works well for small datasets.
    const levenshtein = (a: string, b: string): number => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,      // deletion
                    matrix[i][j - 1] + 1,      // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }
        return matrix[a.length][b.length];
    };

    const searchFiles = useCallback((query: string): MarkdownContent[] => {
        if (!query.trim()) return files;
        const lowercaseQuery = query.toLowerCase();

        // Fuzzy match threshold: allow up to 2 edits for short queries, 3 for longer
        const fuzzyThreshold = lowercaseQuery.length <= 4 ? 1 : 2;

        // Score and filter files
        const scored = files
            .map(file => {
                const title = file.extractedTitle.toLowerCase();
                const id = file.id.toLowerCase();
                const content = file.content.toLowerCase();

                // Fuzzy match for title and id
                const titleDistance = levenshtein(title, lowercaseQuery);
                const idDistance = levenshtein(id, lowercaseQuery);

                // Substring match for content
                const contentMatch = content.includes(lowercaseQuery);

                // Score: lower is better
                let score = 100;
                if (title.includes(lowercaseQuery)) score = 0;
                else if (id.includes(lowercaseQuery)) score = 1;
                else if (titleDistance <= fuzzyThreshold) score = 2 + titleDistance;
                else if (idDistance <= fuzzyThreshold) score = 4 + idDistance;
                else if (contentMatch) score = 10;

                return { file, score };
            })
            .filter(({ score }) => score < 100)
            .sort((a, b) => a.score - b.score);

        return scored.map(({ file }) => file);
    }, [files]);

    const refreshFiles = useCallback(() => {
        fetchFiles();
    }, [fetchFiles]);

    // Memoized service object
    const markdownService = useMemo(() => ({
        files,
        loading,
        error,
        getFiles: () => files,
        getFileById,
        searchFiles,
        refreshFiles
    }), [files, loading, error, getFileById, searchFiles, refreshFiles]);

    return markdownService;
};

// Export a singleton instance for non-hook usage (deprecated, use hook instead)
export const markdownService = {
    getFiles: async (): Promise<MarkdownContent[]> => {
        console.warn('markdownService singleton is deprecated. Use useMarkdownService hook instead.');
        return [];
    },

    getFileById: async (): Promise<MarkdownContent | null> => {
        console.warn('markdownService singleton is deprecated. Use useMarkdownService hook instead.');
        return null;
    },

    searchFiles: async (): Promise<MarkdownContent[]> => {
        console.warn('markdownService singleton is deprecated. Use useMarkdownService hook instead.');
        return [];
    },

    getFilesByTag: async (): Promise<MarkdownContent[]> => {
        console.warn('markdownService singleton is deprecated. Use useMarkdownService hook instead.');
        return [];
    }
};
