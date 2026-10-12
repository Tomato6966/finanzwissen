import { useCallback } from 'react';
import LZString from 'lz-string';
import { copyShareUrlToClipboard, getShareUrl } from './share-utils';

type CalculatorType = 'compound' | 'withdrawal' | 'retirement' | 'goals' | 'montecarlo' | 'budget-analysis';

export function useShareCalculator<T>(calculatorType: CalculatorType, data: T) {
    const handleShare = useCallback(() => {
        const dataToShare = {
            type: calculatorType,
            data: data,
        };
        const encodedData = LZString.compressToEncodedURIComponent(
            JSON.stringify(dataToShare)
        );
        const shareUrl = getShareUrl(calculatorType, encodedData);

        copyShareUrlToClipboard(shareUrl).then((success) => {
            if (success) {
                console.log('Share link copied to clipboard!');
            }
        });
    }, [calculatorType, data]);

    return handleShare;
}
