import { ArrowRight, BookOpen, Clock, FileText, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LinkButton from "./ui/linkButton";

interface MarkdownFileCardProps {
  id: string;
  title: string;
  preview: string;
  author: string;
  path: string;
}

const MarkdownFileCard = ({
  title,
  preview,
  author,
  path,
}: MarkdownFileCardProps) => {
  return (
    <Card className="flex flex-col justify-between border border-border/60 bg-card/80 hover:border-primary/40 hover:shadow-lg transition-all rounded-xl overflow-hidden">
      <CardHeader className="pb-3 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5 font-medium">
            <User className="h-3.5 w-3.5 text-primary" />
            <span>@{author}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] bg-muted px-2 py-0.5 rounded-md">
            <Clock className="h-3 w-3" />
            3 Min. Lesezeit
          </span>
        </div>

        <CardTitle className="text-base sm:text-lg font-bold leading-snug text-card-foreground group-hover:text-primary transition-colors flex items-start gap-2">
          <FileText className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {preview}
        </p>

        <LinkButton
          href={path}
          className="w-full justify-between text-xs sm:text-sm group"
          variant="outline"
        >
          <span>Artikel lesen</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </LinkButton>
      </CardContent>
    </Card>
  );
};

export default MarkdownFileCard;
