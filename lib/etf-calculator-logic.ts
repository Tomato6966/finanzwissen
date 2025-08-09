import { ETFInvestmentData } from "./calculator-types";

export interface ETFRecommendation {
    name: string;
    weight: number;
    ticker?: string;
    isin?: string;
    description?: string;
    ter?: number; // Total Expense Ratio
    justEtfUrl?: string;
    historicalReturn?: number;
    volatility?: number;
}

export interface Projection {
    futureValue: number;
    totalInvestment: number;
    totalProfit: number;
    chartData?: Array<{
        year: number;
        value: number;
        contributions: number;
        returns: number;
    }>;
}

// Enhanced ETF database with experience-based categorization
const ETF_DATABASE: Record<string, ETFRecommendation> = {
    // BEGINNER-FRIENDLY: Simple, broad global ETFs
    'FTSE_ALL_WORLD': {
        name: 'FTSE All-World',
        weight: 0,
        ticker: 'VHYL.SW',
        isin: 'IE00BK5BQT80',
        description: 'Perfekt für Einsteiger - breite globale Diversifikation',
        ter: 0.22,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00BK5BQT80',
        historicalReturn: 7.8,
        volatility: 15.8
    },
    'MSCI_ACWI_IMI': {
        name: 'MSCI ACWI IMI',
        weight: 0,
        ticker: 'IMID.SW',
        isin: 'IE00B3YLTY66',
        description: 'Alternative zum FTSE_ALL_WORLD nur mit Small-Caps',
        ter: 0.40,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B3YLTY66',
        historicalReturn: 7.6,
        volatility: 16.1
    },
    'MSCI_ACWI': {
        name: 'MSCI ACWI',
        weight: 0,
        ticker: 'SSAC.L',
        isin: 'IE00B6R52259',
        description: 'Einfache globale Marktabdeckung',
        ter: 0.20,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B6R52259',
        historicalReturn: 7.4,
        volatility: 15.7
    },

    // INTERMEDIATE: Regional ETFs for diversification
    'MSCI_WORLD': {
        name: 'MSCI World',
        weight: 0,
        ticker: 'URTH',
        isin: 'IE00B4L5Y983',
        description: 'Entwickelte Märkte weltweit',
        ter: 0.20,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B4L5Y983',
        historicalReturn: 7.5,
        volatility: 15.2
    },
    'MSCI_EM': {
        name: 'MSCI Emerging Markets',
        weight: 0,
        ticker: 'IEMS.L',
        isin: 'IE00B4L5YC18',
        description: 'Schwellenländer für zusätzliche Diversifikation',
        ter: 0.18,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B4L5YC18',
        historicalReturn: 5.8,
        volatility: 21.5
    },
    'STOXX_600': {
        name: 'STOXX Europe 600',
        weight: 0,
        ticker: 'EXSA.DE',
        isin: 'IE00B60SX394',
        description: 'Breite europäische Marktabdeckung',
        ter: 0.07,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B60SX394',
        historicalReturn: 6.9,
        volatility: 16.8
    },

    // ADVANCED/EXPERT: Specific regional and sector ETFs
    'SP500': {
        name: 'S&P 500',
        weight: 0,
        ticker: 'VUAA.L',
        isin: 'IE00B3XXRP09',
        description: 'US Large-Cap Aktien - für Fortgeschrittene',
        ter: 0.07,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B3XXRP09',
        historicalReturn: 8.1,
        volatility: 16.8
    },
    'NASDAQ_100': {
        name: 'Nasdaq 100',
        weight: 0,
        ticker: 'EQQQ.L',
        isin: 'IE0032077012',
        description: 'US Tech-Aktien - nur für Experten empfohlen',
        ter: 0.20,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE0032077012',
        historicalReturn: 9.2,
        volatility: 22.1
    },

    'MSCI_JAPAN': {
        name: 'MSCI Japan',
        weight: 0,
        ticker: 'IJPA.L',
        isin: 'IE00B4L5YX21',
        description: 'Japanische Aktien - nur für Experten empfohlen',
    },
    'MSCI_ASIA_PACIFIC': {
        name: 'MSCI Asia Pacific',
        weight: 0,
        ticker: 'VGEJ.DE',
        isin: 'IE00B9F5YL18',
        description: 'Asiatische Aktien - nur für Experten empfohlen',
    },

    // BONDS
    'GLOBAL_BONDS': {
        name: 'Global Aggregate Bonds',
        weight: 0,
        ticker: 'AGGG.L',
        isin: 'IE00B3DKXQ41',
        description: 'Globale Anleihen für Stabilität',
        ter: 0.10,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B3DKXQ41',
        historicalReturn: 2.1,
        volatility: 4.2
    },
    'EUR_GOVERNMENT_BONDS': {
        name: 'Euro Government Bonds',
        weight: 0,
        ticker: 'IBGS.L',
        isin: 'IE00B4WXJG34',
        description: 'Sichere europäische Staatsanleihen',
        ter: 0.07,
        justEtfUrl: 'https://www.justetf.com/de/etf-profile.html?isin=IE00B4WXJG34',
        historicalReturn: 1.8,
        volatility: 3.8
    }
};

export const calculateRiskProfile = (formData: ETFInvestmentData): { stockAllocation: number; bondAllocation: number; riskScore: number } => {
    const { age, riskTolerance, investmentHorizon, experience } = formData;

    // Age-based allocation (rule of thumb: 100 - age = stock allocation)
    let baseStockAllocation = Math.max(20, 100 - age);

    // Risk tolerance adjustments
    if (riskTolerance === 'conservative') {
        baseStockAllocation *= 0.7;
    } else if (riskTolerance === 'aggressive') {
        baseStockAllocation = Math.min(95, baseStockAllocation * 1.3);
    }

    // Investment horizon adjustments
    if (investmentHorizon === 'short') {
        baseStockAllocation *= 0.6;
    } else if (investmentHorizon === 'long') {
        baseStockAllocation = Math.min(95, baseStockAllocation * 1.1);
    }

    // Experience adjustments
    if (experience === 'beginner') {
        baseStockAllocation *= 0.9;
    } else if (experience === 'expert') {
        baseStockAllocation = Math.min(95, baseStockAllocation * 1.05);
    }

    const stockAllocation = Math.max(10, Math.min(95, Math.round(baseStockAllocation)));
    const bondAllocation = 100 - stockAllocation;

    // Calculate risk score (1-10 scale)
    const riskScore = Math.round(
        (stockAllocation / 10) +
        (riskTolerance === 'aggressive' ? 2 : riskTolerance === 'conservative' ? -2 : 0) +
        (experience === 'expert' ? 1 : experience === 'beginner' ? -1 : 0) +
        (investmentHorizon === 'long' ? -5 : 0) +
        (investmentHorizon === 'medium' ? -1 : 0) +
        (investmentHorizon === 'normal' ? -3 : 0) +
        (investmentHorizon === 'short' ? 3 : 0)
    );

    return { stockAllocation, bondAllocation, riskScore: Math.max(1, Math.min(10, riskScore)) };
};

const addRec = (recs: ETFRecommendation[], etfKey: keyof typeof ETF_DATABASE, weight: number, description?: string) => {
    const etf = { ...ETF_DATABASE[etfKey], weight };
    if (description) etf.description = description;
    recs.push(etf);
};

export const getETFRecommendations = (
    stockAllocation: number,
    regions: string[],
    formData: ETFInvestmentData
): ETFRecommendation[] => {
    const recs: ETFRecommendation[] = [];
    const stockWeight = stockAllocation / 100;
    const bondWeight = 1 - stockWeight;
    const { experience, riskTolerance } = formData;
    const includesUSA = regions.includes('USA');
    const includesEurope = regions.includes('Europa');
    const includesEmerging = regions.includes('Schwellenländer');
    const includesTech = regions.includes('Technologie');
    const includesJapan = regions.includes('Japan');
    const includesAsiaPacific = regions.includes('Asien-Pazifik');
    const isGlobal = regions.includes('Global');
    const isComprehensive = includesUSA && includesEurope && includesEmerging && !isGlobal;
    const includesOtherCountroes = [includesEurope, includesEmerging, includesJapan, includesAsiaPacific].filter(Boolean).length;

    // Bonds
    if (bondWeight > 0) {
        addRec(
            recs,
            riskTolerance === 'conservative' ? 'EUR_GOVERNMENT_BONDS' : 'GLOBAL_BONDS',
            bondWeight
        );
    }

    // Stocks
    if (stockWeight <= 0) return recs;

    // --- BEGINNER ---
    if (experience === 'beginner') {
        addRec(recs, 'FTSE_ALL_WORLD', stockWeight, 'Einfach & global – ein ETF statt drei');
        addRec(recs, 'MSCI_ACWI_IMI', stockWeight, 'Alternative mit Small-Caps');
        return recs;
    }

    // --- INTERMEDIATE ---
    if (experience === 'intermediate') {

        if (isGlobal || regions.length === 0 || isComprehensive) {
            addRec(recs, 'MSCI_WORLD', stockWeight * 0.75);
            addRec(recs, 'MSCI_EM', stockWeight * 0.15);
            addRec(recs, 'STOXX_600', stockWeight * 0.10);
            addRec(recs, 'FTSE_ALL_WORLD', stockWeight, 'single-etf-alternative: Ein ETF statt drei');
            addRec(recs, 'MSCI_ACWI_IMI', stockWeight, 'single-etf-alternative: Alternative mit Small-Caps');
        } else {
            if (includesEurope) addRec(recs, 'STOXX_600', stockWeight * 0.4);
            if (includesUSA) addRec(recs, 'MSCI_WORLD', stockWeight * 0.4);
            if (includesEmerging) addRec(recs, 'MSCI_EM', stockWeight * 0.2);
        }
        return recs;
    }

    // --- EXPERT ---
    if (experience === 'expert') {

        // Case: Tech-heavy USA
        if (includesUSA && includesOtherCountroes <= 0) {
            if(includesTech) {
                addRec(recs, 'NASDAQ_100', stockWeight * 0.3);
                addRec(recs, 'SP500', stockWeight * 0.7);
            }
            else {
                addRec(recs, 'SP500', stockWeight);
            }
            // Fill rest with global coverage if needed
            // const restWeight = currentWeight - (currentWeight * 0.2 + currentWeight * 0.4);
            // if (restWeight > 0) addRec(recs, 'FTSE_ALL_WORLD', restWeight);
            return recs;
        }
        else if (
            includesUSA && includesOtherCountroes > 0 && includesOtherCountroes <= 1 && !isGlobal
        ) {
            if(includesTech) {
                addRec(recs, 'NASDAQ_100', stockWeight * 0.3);
                addRec(recs, 'SP500', stockWeight * 0.55);
                if(includesEurope) addRec(recs, 'STOXX_600', stockWeight * 0.25);
                if(includesEmerging) addRec(recs, 'MSCI_EM', stockWeight * 0.25);
                if(includesJapan) addRec(recs, 'MSCI_JAPAN', stockWeight * 0.25);
                if(includesAsiaPacific) addRec(recs, 'MSCI_ASIA_PACIFIC', stockWeight * 0.25);
            }
            else {
                addRec(recs, 'SP500', stockWeight * 0.75);
                if(includesEurope) addRec(recs, 'STOXX_600', stockWeight * 0.25);
                if(includesEmerging) addRec(recs, 'MSCI_EM', stockWeight * 0.25);
                if(includesJapan) addRec(recs, 'MSCI_JAPAN', stockWeight * 0.25);
                if(includesAsiaPacific) addRec(recs, 'MSCI_ASIA_PACIFIC', stockWeight * 0.25);
            }
            return recs;
        }
        // Case: USA + 2 other Countries
        else if (
            includesUSA && includesOtherCountroes > 1  && includesOtherCountroes <= 2 && !isGlobal
        ) {
            if(includesTech) {
                addRec(recs, 'NASDAQ_100', stockWeight * 0.3);
                addRec(recs, 'SP500', stockWeight * 0.55);
                if(includesEurope) addRec(recs, 'STOXX_600', stockWeight * 0.125);
                if(includesEmerging) addRec(recs, 'MSCI_EM', stockWeight * 0.125);
                if(includesJapan) addRec(recs, 'MSCI_JAPAN', stockWeight * 0.125);
                if(includesAsiaPacific) addRec(recs, 'MSCI_ASIA_PACIFIC', stockWeight * 0.125);
            }
            else {
                addRec(recs, 'SP500', stockWeight * 0.7);
                if(includesEurope) addRec(recs, 'STOXX_600', stockWeight * 0.15);
                if(includesEmerging) addRec(recs, 'MSCI_EM', stockWeight * 0.15);
                if(includesJapan) addRec(recs, 'MSCI_JAPAN', stockWeight * 0.15);
                if(includesAsiaPacific) addRec(recs, 'MSCI_ASIA_PACIFIC', stockWeight * 0.15);
            }
            return recs;
        }
        else if (
            includesUSA && (includesOtherCountroes > 2 || isGlobal)
        ) {
            if(includesTech) {
                addRec(recs, 'NASDAQ_100', stockWeight * 0.3);
                addRec(recs, 'FTSE_ALL_WORLD', stockWeight * 0.3);
                addRec(recs, 'SP500', stockWeight * 0.5);
            }
            else {
                addRec(recs, 'FTSE_ALL_WORLD', stockWeight * 0.5);
                addRec(recs, 'SP500', stockWeight * 0.5);
            }
            return recs;
        }

        // Case: Only USA
        if (includesUSA && !includesEurope && !includesEmerging) {
            addRec(recs, 'SP500', stockWeight * 0.7);
            addRec(recs, 'NASDAQ_100', stockWeight * 0.3);
            return recs;
        }

        // Case: No USA picked → fallback to MSCI World + EM
        addRec(recs, 'MSCI_WORLD', stockWeight * 0.8);
        addRec(recs, 'MSCI_EM', stockWeight * 0.2);
        return recs;
    }

    return recs
        .filter(r => r.weight > 0.01);
};


// Helper function to get available regions based on experience
export const getAvailableRegions = (experience: string): Array<{label: string, value: string}> => {
    if (experience === 'beginner') {
        return [
            { label: 'Global (Empfohlen für Anfänger)', value: 'Global' }
        ];
    } else if (experience === 'intermediate') {
        return [
            { label: 'Global (Weltweit)', value: 'Global' },
            { label: 'USA', value: 'USA' },
            { label: 'Europa', value: 'Europa' },
            { label: 'Schwellenländer', value: 'Schwellenländer' }
        ];
    } else {
        return [
            { label: 'Global (Weltweit)', value: 'Global' },
            { label: 'USA', value: 'USA' },
            { label: 'Europa', value: 'Europa' },
            { label: 'Schwellenländer', value: 'Schwellenländer' },
            { label: 'Asien-Pazifik', value: 'Asien-Pazifik' },
            { label: 'Technologie', value: 'Technologie' },
            { label: 'Japan', value: 'Japan' }
        ];
    }
};

export const calculateProjection = (formData: ETFInvestmentData, stockAllocation: number, bondAllocation: number, recommendations: ETFRecommendation[]): { projection10Years: Projection; projection20Years: Projection; annualReturn: number } => {
    const { startingCapital, contributionAmount, contributionInterval, includeInflation } = formData;
    const inflationRate = 0.025;

    const intervalMap = {
        daily: 365,
        weekly: 52,
        'bi-weekly': 26,
        monthly: 12,
        quarterly: 4,
        yearly: 1,
    };

    const annualContribution = contributionAmount * intervalMap[contributionInterval];

    // Calculate weighted average return based on actual ETF recommendations
    const annualReturn = recommendations.filter(etf => !etf.description?.includes("single-etf-alternative")).reduce((acc, rec) => {
        const etfReturn = rec.historicalReturn ? rec.historicalReturn / 100 :
            (rec.name.toLowerCase().includes('bond') ? 0.02 : 0.07);
        return acc + (rec.weight * etfReturn);
    }, 0) - (includeInflation ? inflationRate : 0);

    // more fancy way of calcuting inflation result, however then the substraction of return needs to be removed. and that can be confusing for the user, why the inflation is not included in the return, therefore we use the "simple approach" which leads to less total value due to accuracy inconsistency
    const widthInflation = false; // includeInflation;

    const projection = (years: number): Projection => {
        let futureValue = startingCapital;
        let totalInvestment = startingCapital;
        const chartData = [];

        for (let i = 0; i <= years; i++) {
            if (i > 0) {
                futureValue = futureValue * (1 + annualReturn) + annualContribution;
                totalInvestment += annualContribution;
            }

            const adjustedValue = widthInflation ?
                futureValue / Math.pow(1 + inflationRate, i) : futureValue;

            const realContributions = widthInflation ?
                totalInvestment / Math.pow(1 + inflationRate, i) : totalInvestment;

            chartData.push({
                year: i,
                value: adjustedValue,
                contributions: realContributions,
                returns: adjustedValue - realContributions
            });
        }

        const finalValue = widthInflation ?
            futureValue / Math.pow(1 + inflationRate, years) : futureValue;

        const realTotalInvestment = widthInflation ?
            totalInvestment / Math.pow(1 + inflationRate, years) : totalInvestment;

        const totalProfit = finalValue - realTotalInvestment;

        return {
            futureValue: finalValue,
            totalInvestment: realTotalInvestment,
            totalProfit,
            chartData
        };
    };

    const projection10Years = projection(10);
    const projection20Years = projection(20);

    return { projection10Years, projection20Years, annualReturn };
};

// Helper function to get detailed return breakdown
export const getReturnBreakdown = (recommendations: ETFRecommendation[]): Array<{name: string, weight: number, expectedReturn: number, contribution: number}> => {
    return recommendations.filter(etf => !etf.description?.includes("single-etf-alternative")).map(rec => {
        const expectedReturn = rec.historicalReturn ? rec.historicalReturn :
            (rec.name.toLowerCase().includes('bond') || rec.name.toLowerCase().includes('anleihe') ? 2.0 : 7.0);
        const contribution = (rec.weight * expectedReturn) / 100;

        return {
            name: rec.name,
            weight: rec.weight * 100, // Convert to percentage
            expectedReturn: expectedReturn,
            contribution: contribution * 100 // Convert to percentage
        };
    });
};
