import { LucideClockFading } from "lucide-react";

import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";

export default function LoadingCard() {
    return <Card className="w-full max-w-6xl shadow-xl rounded-lg overflow-hidden py-0">
        <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-lg flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-3xl font-bold flex items-center gap-4">
                    <LucideClockFading /> Loading Config
                </CardTitle>
                <CardDescription className="text-primary-foreground opacity-90 text-sm mt-2">
                    Loading the shared config, please wait
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8 pb-6 min-h-80">

        </CardContent>
        <CardFooter className="p-6 text-sm text-gray-500 flex justify-between items-center">
            <p>
                Hinweis: Dies ist ein Modell, keine Garantie. Die tatsächliche Rendite kann von der hier angegebenen Schätzung abweichen.
            </p>
        </CardFooter>
    </Card>
}
