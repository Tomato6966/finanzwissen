import { Suspense } from 'react';
import CalculatorsClient from './CalculatorsClient';

export default function CalculatorsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CalculatorsClient />
        </Suspense>
    );
}