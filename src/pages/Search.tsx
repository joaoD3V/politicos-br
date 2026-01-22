import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/deputies/SearchBar";
import { FilterPanel } from "@/components/deputies/FilterPanel";
import { DeputyCard } from "@/components/deputies/DeputyCard";
import { EmptyState } from "@/components/ui/empty-state";
import { searchDeputies } from "@/data/mockDeputies";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({ partido: "", uf: "", situacao: "" });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? "" : value }));
  };

  const clearFilters = () => {
    setFilters({ partido: "", uf: "", situacao: "" });
  };

  const handleSearch = () => {
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const results = useMemo(() => {
    return searchDeputies(query, filters);
  }, [query, filters]);

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Buscar Deputados
          </h1>
          <p className="text-muted-foreground">
            Encontre deputados federais por nome, partido ou estado
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}
        </div>

        {results.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map(deputy => (
              <DeputyCard key={deputy.id} deputy={deputy} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum resultado encontrado"
            description="Tente ajustar os filtros ou buscar por outro termo"
          />
        )}
      </div>
    </Layout>
  );
}
