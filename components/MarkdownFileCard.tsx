import { ExternalLink, FileText } from "lucide-react";

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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between -mt-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-300 dark:text-gray-700 italic">
              @{author}
            </p>
          </div>
          <CardTitle className="w-full text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4 line-clamp-3">
          {preview}
        </p>
        <LinkButton
          href={path}
          className="w-full"
          variant="outline"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open File
        </LinkButton>
      </CardContent>
    </Card>
  );
};

export default MarkdownFileCard;
