import { TrendingUp } from "lucide-react";

export default function Footer() {
    return <footer className="bg-white border-t mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-lg font-semibold">FinanzWissen</span>
            </div>
            <p className="text-gray-600">Ihre Reise zur finanziellen Bildung und Unabhängigkeit beginnt hier.</p>
        </div>
    </div>
</footer>;
}
