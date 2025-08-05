import { useCallback } from 'react';
import LZString from 'lz-string';
import { usePathname } from 'next/navigation';

type CalculatorType = 'compound' | 'withdrawal' | 'retirement' | 'goals' | 'montecarlo' | 'budget-analysis';

export function useShareCalculator<T>(calculatorType: CalculatorType, data: T) {
    const pathname = usePathname();

    const handleShare = useCallback(() => {
        const dataToShare = {
            type: calculatorType,
            data: data,
        };
        const encodedData = LZString.compressToEncodedURIComponent(
            JSON.stringify(dataToShare)
        );
        const shareUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}${pathname}?share=${encodedData}#${calculatorType}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            // In a real application, you might want to show a toast notification
            console.log('Share link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy share link:', err);
        });
    }, [calculatorType, data, pathname]);

    return handleShare;
}
