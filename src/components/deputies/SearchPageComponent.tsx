'use client';

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { DeputyCard } from "./DeputyCard";
import { FilterPanel } from "./FilterPanel";
import { DeputyCardSkeleton } from "./DeputyCardSkeleton";
import { mockDeputies } from "@/data/mockDeputies";
import type { Deputy } from "@/data/mockDeputies";
import { CamaraAPI } from "@/services/camara-api";

interface SearchPageComponentProps {
  initialQuery?: string;
}

interface Filters {
  partido: string;
  uf: string;
  situacao: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function SearchPageComponent({ initialQuery = "" }: SearchPageComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [allDeputies, setAllDeputies] = useState<Deputy[]>([]);
  const [filteredDeputies, setFilteredDeputies] = useState<Deputy[]>([]);
  const [filters, setFilters] = useState<Filters>({
    partido: "",
    uf: "",
    situacao: ""
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });
  const [isLoading, setIsLoading] = useState(false);

  // Busca deputados com base nos critérios usando API real
  const fetchDeputies = async (query: string, currentFilters: Filters, page: number = 1) => {
    setIsLoading(true);
    
    try {
      const deputies = await CamaraAPI.searchWithFilters({
        query,
        partido: currentFilters.partido,
        uf: currentFilters.uf,
        itens: 600 // Busca todos os deputados para paginar no lado do cliente
      });

      setAllDeputies(deputies);
      
      // Aplica filtros adicionais
      let filtered = deputies;

      // Filtra por nome/palavra-chave adicional
      if (query) {
        filtered = filtered.filter((deputy) =>
          deputy.nome.toLowerCase().includes(query.toLowerCase()) ||
          deputy.partido.toLowerCase().includes(query.toLowerCase()) ||
          deputy.uf.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Filtra por situação (não disponível na API)
      if (currentFilters.situacao) {
        filtered = filtered.filter((deputy) => deputy.situacao === currentFilters.situacao);
      }

      setFilteredDeputies(filtered);
      
      // Atualiza paginação
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
      
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages,
        totalItems
      }));
      
    } catch (error) {
      console.error('Erro ao buscar deputados da API:', error);
      // Fallback para dados mock se API falhar
      let filtered = mockDeputies;

      if (query) {
        filtered = filtered.filter((deputy) =>
          deputy.nome.toLowerCase().includes(query.toLowerCase()) ||
          deputy.partido.toLowerCase().includes(query.toLowerCase()) ||
          deputy.uf.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (currentFilters.partido) {
        filtered = filtered.filter((deputy) => deputy.partido === currentFilters.partido);
      }

      if (currentFilters.uf) {
        filtered = filtered.filter((deputy) => deputy.uf === currentFilters.uf);
      }

      if (currentFilters.situacao) {
        filtered = filtered.filter((deputy) => deputy.situacao === currentFilters.situacao);
      }

      setAllDeputies(mockDeputies);
      setFilteredDeputies(filtered);
      
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
      
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages,
        totalItems
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza URL quando a busca muda
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (filters.partido) params.set("party", filters.partido);
    if (filters.uf) params.set("uf", filters.uf);
    if (filters.situacao) params.set("situacao", filters.situacao);
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (newFilters.partido) params.set("party", newFilters.partido);
    if (newFilters.uf) params.set("uf", newFilters.uf);
    if (newFilters.situacao) params.set("situacao", newFilters.situacao);
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl);
  };

  // Aplica filtros
  const applyFilters = () => {
    fetchDeputies(searchQuery, filters, 1);
  };

  // Limpa filtros
  const clearFilters = () => {
    setFilters({ partido: "", uf: "", situacao: "" });
    setSearchQuery("");
    router.replace(pathname);
  };

  // Função para mudar de página
  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Obtém os itens da página atual
  const getCurrentPageItems = () => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredDeputies.slice(startIndex, endIndex);
  };

  // Inicializa busca
  useEffect(() => {
    fetchDeputies(searchQuery, filters, 1);
  }, []);

  // Reaplica filtros quando eles mudam
  useEffect(() => {
    if (filters.partido || filters.uf || filters.situacao) {
      applyFilters();
    }
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Buscar Deputados
            </h1>
            <p className="text-lg text-muted-foreground">
              Encontre informações sobre deputados federais
            </p>
          </div>

          {/* Barra de busca principal */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={updateSearchQuery}
              onSubmit={applyFilters}
              size="lg"
              disabled={isLoading}
            />
          </div>

          {/* Painel de filtros acima dos resultados */}
          <div className="mb-8">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Resultados */}
          <div className="flex-1">
            {/* Contador de resultados */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">
                {isLoading
                  ? "Buscando..."
                  : `${pagination.totalItems} deputado${
                      pagination.totalItems !== 1 ? "s" : ""
                    } encontrado${pagination.totalItems !== 1 ? "s" : ""}`}
              </h2>
              
              {!isLoading && pagination.totalItems > 0 && (
                <div className="text-sm text-muted-foreground">
                  Página {pagination.currentPage} de {pagination.totalPages} 
                  ({(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems})
                  {pagination.totalItems < 500 && (
                    <span className="ml-2 text-xs">✓ Base completa</span>
                  )}
                </div>
              )}
            </div>

            {/* Lista de resultados */}
            <div className="mb-8">
              {isLoading ? (
                // Skeletons durante carregamento em grid de 2 colunas
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <DeputyCardSkeleton key={index} />
                  ))}
                </div>
              ) : getCurrentPageItems().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCurrentPageItems().map((deputy) => (
                    <DeputyCard
                      key={deputy.id}
                      deputy={deputy}
                      highlight={searchQuery}
                    />
                  ))}
                </div>
              ) : (
                // Estado vazio
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhum deputado encontrado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar seus critérios de busca ou filtros
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            {/* Paginação */}
            {!isLoading && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => changePage(1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Primeira
                </button>
                <button
                  onClick={() => changePage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Anterior
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNumber = pagination.totalPages - 4 + index;
                    } else {
                      pageNumber = pagination.currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => changePage(pageNumber)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          pagination.currentPage === pageNumber
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => changePage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Próxima
                </button>
                <button
                  onClick={() => changePage(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                >
                  Última
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
