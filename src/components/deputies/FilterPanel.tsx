import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { partidos, estados } from "@/data/mockDeputies";

interface FilterPanelProps {
  filters: {
    partido: string;
    uf: string;
    situacao: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({ filters, onFilterChange, onClearFilters }: FilterPanelProps) {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-1 h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {/* Partido Filter */}
        <Select
          value={filters.partido}
          onValueChange={(value) => onFilterChange("partido", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os partidos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os partidos</SelectItem>
            {partidos.map((partido) => (
              <SelectItem key={partido} value={partido}>
                {partido}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Estado Filter */}
        <Select
          value={filters.uf}
          onValueChange={(value) => onFilterChange("uf", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {estados.map((estado) => (
              <SelectItem key={estado.sigla} value={estado.sigla}>
                {estado.sigla} - {estado.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Situação Filter */}
        <Select
          value={filters.situacao}
          onValueChange={(value) => onFilterChange("situacao", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as situações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as situações</SelectItem>
            <SelectItem value="Exercício">Em Exercício</SelectItem>
            <SelectItem value="Afastado">Afastado</SelectItem>
            <SelectItem value="Licenciado">Licenciado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
