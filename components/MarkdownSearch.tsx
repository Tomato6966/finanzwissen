import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface MarkdownSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const MarkdownSearch = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search markdown files..."
}: MarkdownSearchProps) => {
  return (
    <div className="flex items-center space-x-2 max-w-md mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default MarkdownSearch;
