import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  size?: "default" | "lg";
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Buscar deputado por nome ou partido...",
  className,
  size = "default",
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
            size === "lg" ? "h-5 w-5 left-4" : "h-4 w-4"
          )}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "pr-24",
            size === "lg"
              ? "h-14 pl-12 text-lg rounded-xl"
              : "h-10 pl-10"
          )}
        />
        <Button
          type="submit"
          size={size === "lg" ? "default" : "sm"}
          className={cn(
            "absolute right-1.5 top-1/2 -translate-y-1/2",
            size === "lg" && "right-2"
          )}
        >
          Buscar
        </Button>
      </div>
    </form>
  );
}
