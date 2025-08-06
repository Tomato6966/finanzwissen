import { Download, ExternalLink } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LinkButton from "@/components/ui/linkButton";
import { TabsContent } from "@/components/ui/tabs";

import { ToolCategory } from "./ToolCategories";

export function ToolsTabsContentsWrapper({ categories }: { categories: ToolCategory[] }) {
    return (
        <>
            {categories.map((category) => <ToolsTabContent key={category.id} category={category} />)}
        </>
    );
}

export function ToolsTabContent({ category }: { category: ToolCategory }) {
    return (
        <TabsContent key={category.id} value={category.id} className="mt-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, index: number) => (
                    <Card key={index} className="hover:shadow-xl pt-0 cursor-cell transition-all duration-300 group overflow-hidden hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30 rounded-lg">
                        <div className="relative overflow-hidden h-full w-full">
                            {item.image && item.image.endsWith(".mp4") ? (
                                <video src={item.image} autoPlay muted loop className="w-full h-54 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg" />
                            ) : (
                                <Image
                                    src={`${item.image || (process.env.NEXT_PUBLIC_BASE_PATH || '' + "/placeholder.svg")}`}
                                    alt={item.title}
                                    width={800}
                                    height={192}
                                    className="w-full h-54 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                                    unoptimized
                                />
                            )}
                            {/* Display category as a badge if needed, or other specific badges */}
                            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 dark:text-card-foreground dark:bg-card rounded-md">{category.title}</Badge>
                            {item.link.href && item.link.isExternal && (
                                <Badge className="absolute top-3 right-3 bg-blue-600 text-white rounded-md">External-Tool</Badge>
                            )}
                            {item.link.href && !item.link.isExternal && (
                                <Badge className="absolute top-3 right-3 bg-green-600 text-white rounded-md">Internal-Tool</Badge>
                            )}
                            {item.link.href && !item.link.isExternal && "download" in item.link && item.link.download === true && (
                                <Badge className="absolute top-3 right-3 bg-purple-600 text-white rounded-md">File-Download</Badge>
                            )}
                        </div>

                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-gray-900 dark:text-card-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-muted-foreground line-clamp-2">{item.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0 flex justify-end">
                            {"download" in item.link && item.link.download === true ? (
                                <Button size="sm" className="w-full">
                                    <Download className="w-4 h-4 mr-2" onClick={() => {
                                        window.open(item.link.href, "_blank");
                                    }} />
                                    Herunterladen
                                </Button>
                            ) : (
                                <LinkButton href={item.link.href} target={item.link.isExternal ? "_blank" : "_self"} linkClassName="w-full" legacyBehavior={false} rel={item.link.isExternal ? "noopener noreferrer" : ""} size="lg" className="w-full text-xl text-white">
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                    Tool öffnen
                                </LinkButton>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
    )
}
