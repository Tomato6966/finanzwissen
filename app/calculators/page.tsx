import { Suspense } from "react";

import CalculatorsClient from "../../components/Calculators/parentPage/CalculatorsClient";

export default function CalculatorsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CalculatorsClient />
        </Suspense>
    );
}
