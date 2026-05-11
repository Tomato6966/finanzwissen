self.onmessage = (e) => {
    const { principal, time, monthlyContribution, simulations, portfolioDrift, portfolioVolatility, RISK_FREE_RATE, MAX_DISPLAY_PATHS } = e.data;

    const dt = 1 / 252; // Daily time step
    const mu = portfolioDrift / 100; // Annual drift
    const sigma = portfolioVolatility / 100; // Annual volatility
    const monthlyContributionDaily = monthlyContribution / 21; // Distribute monthly contribution over ~21 trading days

    const allPaths = [];
    const allEndValues = [];
    const allMaxDrawdowns = [];
    const allAnnualReturns = [];
    const allSharpeRatios = [];

    // Calculate how often to send a progress message (e.g., every 1% of simulations)
    const progressUpdateInterval = Math.max(1, Math.floor(simulations / 100)); // Update at least once per 1%

    for (let i = 0; i < simulations; i++) {
        const path = [{ x: 0, y: principal }];
        let currentValue = principal;
        let peakValue = principal;
        let currentMaxDrawdown = 0;
        const dailyValues = [principal];

        for (let t = 1; t <= time * 252; t++) {
            const Z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
            currentValue *= Math.exp((mu - Math.pow(sigma, 2) / 2) * dt + sigma * Math.sqrt(dt) * Z);

            currentValue += monthlyContributionDaily;

            dailyValues.push(currentValue);

            peakValue = Math.max(peakValue, currentValue);
            currentMaxDrawdown = Math.max(currentMaxDrawdown, (peakValue - currentValue) / peakValue);

            if (t % 21 === 0) {
                path.push({ x: t / 252, y: currentValue });
            }
        }
        allPaths.push(path);
        allEndValues.push(currentValue);
        allMaxDrawdowns.push(currentMaxDrawdown * 100);

        const avgAnnualReturn = (Math.pow(currentValue / principal, 1 / time) - 1) * 100;
        allAnnualReturns.push(avgAnnualReturn);

        const pathDailyReturns = dailyValues.slice(1).map((val, idx) => (val - dailyValues[idx]) / dailyValues[idx]);
        const pathMeanDailyReturn = pathDailyReturns.reduce((sum, r) => sum + r, 0) / pathDailyReturns.length;
        const pathStdDevDailyReturn = Math.sqrt(pathDailyReturns.map(r => Math.pow(r - pathMeanDailyReturn, 2)).reduce((sum, sd) => sum + sd, 0) / (pathDailyReturns.length - 1));
        const annualizedPathStdDev = pathStdDevDailyReturn * Math.sqrt(252);
        const annualizedExcessReturn = (avgAnnualReturn / 100) - (RISK_FREE_RATE / 100);
        const sharpe = annualizedPathStdDev > 0 ? annualizedExcessReturn / annualizedPathStdDev : 0;
        allSharpeRatios.push(sharpe);

        // Send progress updates back to the main thread less frequently
        if ((i + 1) % progressUpdateInterval === 0 || i === simulations - 1) {
            self.postMessage({ type: 'progress', progress: Math.round(((i + 1) / simulations) * 100) });
        }
    }

    // Calculate overall stats for end values
    allEndValues.sort((a, b) => a - b);
    const overallStats = {
        median: allEndValues[Math.floor(simulations / 2)],
        p10: allEndValues[Math.floor(simulations * 0.1)],
        p90: allEndValues[Math.floor(simulations * 0.9)],
        worst: allEndValues[0],
        best: allEndValues[simulations - 1],
    };

    const getPercentile = (arr, percentile) => {
        arr.sort((a, b) => a - b);
        const index = (percentile / 100) * (arr.length - 1);
        return arr[Math.floor(index)];
    };

    const percentileMetrics = {
        p10: {
            maxDrawdown: getPercentile(allMaxDrawdowns, 10),
            avgAnnualReturn: getPercentile(allAnnualReturns, 10),
            sharpeRatio: getPercentile(allSharpeRatios, 10),
        },
        p25: {
            maxDrawdown: getPercentile(allMaxDrawdowns, 25),
            avgAnnualReturn: getPercentile(allAnnualReturns, 25),
            sharpeRatio: getPercentile(allSharpeRatios, 25),
        },
        p50: {
            maxDrawdown: getPercentile(allMaxDrawdowns, 50),
            avgAnnualReturn: getPercentile(allAnnualReturns, 50),
            sharpeRatio: getPercentile(allSharpeRatios, 50),
        },
        p75: {
            maxDrawdown: getPercentile(allMaxDrawdowns, 75),
            avgAnnualReturn: getPercentile(allAnnualReturns, 75),
            sharpeRatio: getPercentile(allSharpeRatios, 75),
        },
        p90: {
            maxDrawdown: getPercentile(allMaxDrawdowns, 90),
            avgAnnualReturn: getPercentile(allAnnualReturns, 90),
            sharpeRatio: getPercentile(allSharpeRatios, 90),
        },
    };

    const totalContributions = principal + (monthlyContribution * time * 12);

    // --- Path Selection for Visualization ---
    const selectedPathIndices = new Set();
    const finalSelectedPaths = [];

    // Helper to add a path by its original index, avoiding duplicates
    const addPathByIndex = (originalIndex) => {
        if (!selectedPathIndices.has(originalIndex)) {
            selectedPathIndices.add(originalIndex);
            finalSelectedPaths.push(allPaths[originalIndex]);
        }
    };

    // 1. Get the indices of all end values, sorted, to find specific paths
    const indexedEndValues = allEndValues.map((value, index) => ({ value, index }));
    indexedEndValues.sort((a, b) => a.value - b.value);

    // Ensure we have enough simulations for selection, otherwise just take all
    if (simulations > 0) {
        // Add Worst Case
        addPathByIndex(indexedEndValues[0].index);

        // Add Best Case
        addPathByIndex(indexedEndValues[indexedEndValues.length - 1].index);

        // Add Percentile Paths (10th, 25th, 50th, 75th, 90th)
        const percentilesToInclude = [10, 25, 50, 75, 90];
        percentilesToInclude.forEach(p => {
            if (indexedEndValues.length > 1) { // Ensure there's more than one simulation
                const index = Math.floor((p / 100) * (indexedEndValues.length - 1));
                addPathByIndex(indexedEndValues[index].index);
            }
        });

        // Fill remaining slots with a random mix from the unselected paths
        const numPathsToFill = MAX_DISPLAY_PATHS - finalSelectedPaths.length;
        if (numPathsToFill > 0) {
            const availableIndices = Array.from({ length: allPaths.length }, (_, i) => i)
                                        .filter(idx => !selectedPathIndices.has(idx));

            // Shuffle available indices to get a random mix
            for (let i = availableIndices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
            }

            for (let i = 0; i < numPathsToFill && i < availableIndices.length; i++) {
                addPathByIndex(availableIndices[i]);
            }
        }
    } else {
        // If no simulations, ensure paths are empty
        finalSelectedPaths.length = 0;
    }

    // Post the final results back to the main thread
    self.postMessage({
        type: 'result',
        paths: finalSelectedPaths, // Send only the selected paths
        percentileMetrics,
        overallStats,
        totalContributions
    });
};
