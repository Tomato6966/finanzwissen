import { FC, ReactNode } from "react";

export const formatCurrency = (value: number): string => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
export const formatCurrencyPrecise = (value: number): string => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

export const TooltipWrapper: FC<{ content: ReactNode, children: ReactNode }> = ({ content, children }) => (
    <span className="relative group inline-flex items-center">
        {children}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-center text-sm text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
            {content}
        </span>
    </span>
);

export const formatPercentage = (value: number) => new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);


export const handleFormChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) || 0 }));
};

export const handleSelectChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, name: string) => (value: string) => {
    setter(prev => ({ ...prev, [name]: value }));
};

export const handleNumberSelectChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, name: string) => (value: string) => {
    setter(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
};
