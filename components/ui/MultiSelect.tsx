import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Check } from "lucide-react"; // Import Check icon

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

const multiSelectVariants = cva(
  "flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
  }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ options, value, onChange, className, placeholder, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const commandRef = React.useRef<HTMLDivElement>(null); // Ref for the CommandPrimitive div

    const handleSelect = (selectedValue: string) => {
      if (value.includes(selectedValue)) {
        onChange(value.filter((v) => v !== selectedValue));
      } else {
        onChange([...value, selectedValue]);
      }
      setOpen(false); // Close dropdown after selection
    };

    const handleRemove = (selectedValue: string) => {
      onChange(value.filter((v) => v !== selectedValue));
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handler = (event: MouseEvent) => {
        if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }, []);

    return (
      <CommandPrimitive onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      }} ref={commandRef}> {/* Attach ref here */}
        <div className="relative">
          <div
            className={cn(
              multiSelectVariants({ variant: props.variant }),
              "cursor-pointer",
              className
            )}
            onClick={() => setOpen(true)}
          >
            <div className="flex gap-1 flex-wrap">
              {value.map((v) => (
                <Badge key={v} variant="secondary" className="flex items-center">
                  {options.find((o) => o.value === v)?.label}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(v);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleRemove(v)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
              {value.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
          </div>
          {open && (
            <div className="absolute z-10 top-full mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
              <Command>
                <CommandGroup className="h-full overflow-auto">
                  {options.map((option) => {
                    const isSelected = value.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => handleSelect(option.value)}
                        className={cn(
                          "cursor-pointer flex items-center justify-between", // Added justify-between for icon alignment
                          isSelected && "bg-accent text-accent-foreground" // Improved highlighting
                        )}
                      >
                        {option.label}
                        {isSelected && <Check className="h-4 w-4" />} {/* Checkmark icon */}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </div>
          )}
        </div>
      </CommandPrimitive>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
