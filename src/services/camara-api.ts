import { httpClient } from './api-client';
import {
  CamaraApiResponse,
  CamaraDeputado,
  DeputadosSearchParams,
  mapCamaraDeputyToLocal
} from '@/types/api-responses';
import { Deputy, Proposicao, Despesa } from '@/data/mockDeputies';

/**
 * Serviço para integração com a API Dados Abertos da Câmara dos Deputados
 * Documentação: https://dadosabertos.camara.leg.br/api/v2
 */
export class CamaraAPI {
  private static readonly BASE_PATHS = {
    DEPUTADOS: '/api/deputados',
    DEPUTADO_DETAIL: '/api/deputados',
    PROPOSICOES: '/api/proposicoes',
  };

  /**
   * Busca deputados federais
   * Endpoint: GET /deputados
   */
  static async searchDeputies(params: DeputadosSearchParams = {}): Promise<Deputy[]> {
    try {
      const response = await httpClient.get<CamaraApiResponse<CamaraDeputado>>(
        this.BASE_PATHS.DEPUTADOS,
        {
          nome: params.nome?.trim(),
          siglaUf: params.siglaUf?.toUpperCase(),
          siglaPartido: params.siglaPartido?.toUpperCase(),
          itens: params.itens || 20,
          pagina: params.pagina || 1,
          ordem: params.ordem || 'ASC',
          ordenarPor: params.ordenarPor || 'nome',
          ...Object.fromEntries(
            Object.entries(params).filter(([key, value]) => value !== undefined)
          ),
        },
        {
          enableCache: true,
          cacheDuration: 5 * 60 * 1000, // 5 minutos
        }
      );

      // Mapear resposta da API para interface local
      return response.dados.map(mapCamaraDeputyToLocal);
    } catch (error) {
      console.error('Erro ao buscar deputados:', error);
      throw new Error(`Falha ao buscar deputados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Obtém detalhes de um deputado específico
    * Endpoint: GET /api/deputados/{id}
    */
  static async getDeputyById(id: string): Promise<Deputy | null> {
    try {
      const response = await httpClient.get<import('@/types/api-responses').CamaraDetailResponse<CamaraDeputado>>(
        `${this.BASE_PATHS.DEPUTADO_DETAIL}/${id}`,
        {},
        {
          enableCache: true,
          cacheDuration: 10 * 60 * 1000, // 10 minutos para detalhes
        }
      );

      // Debug: log raw response while we verify shapes. Remove later.
      console.debug('Raw API response:', response);
      if (!response.dados || !response.dados.id) {
        return null;
      }

      return mapCamaraDeputyToLocal(response.dados);
    } catch (error) {
      console.error('Erro ao buscar detalhes do deputado:', error);
      throw new Error(`Falha ao buscar detalhes do deputado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Busca proposições legislativas de um deputado
    * Endpoint: GET /api/proposicoes?idAutor={id}
    */
  static async getDeputyProposals(id: string, params: {
    itens?: number;
    pagina?: number;
    ordem?: string;
    ordenarPor?: string;
  } = {}): Promise<Proposicao[]> {
    try {
      const response = await httpClient.get<CamaraApiResponse<any>>(
        this.BASE_PATHS.PROPOSICOES,
        {
          idAutor: parseInt(id),
          itens: params.itens || 20,
          pagina: params.pagina || 1,
          ordem: params.ordem || 'DESC',
          ordenarPor: params.ordenarPor || 'dataApresentacao',
        },
        {
          enableCache: true,
          cacheDuration: 5 * 60 * 1000, // 5 minutos
        }
      );

      // Simplificar proposições
      return (response.dados || []).map(item => ({
        id: item.id.toString(),
        tipo: item.siglaTipo || "",
        numero: item.numero,
        ano: item.ano,
        ementa: item.ementa || "",
        status: item.statusProposicao?.sigla || "Em Tramitação",
        dataApresentacao: item.dataApresentacao || "",
      }));
    } catch (error) {
      console.error('Erro ao buscar proposições:', error);
      throw new Error(`Falha ao buscar proposições: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Busca despesas parlamentares de um deputado
    * Endpoint: GET /api/deputados/{id}?ano={ano}
    */
  static async getDeputyExpenses(id: string, params: {
    ano?: number;
    itens?: number;
    pagina?: number;
    ordem?: string;
    ordenarPor?: string;
  } = {}): Promise<Despesa[]> {
    try {
      const response = await httpClient.get<CamaraApiResponse<any>>(
        `${this.BASE_PATHS.DEPUTADO_DETAIL}/${id}`,
        {
          ano: params.ano,
          itens: params.itens || 20,
          pagina: params.pagina || 1,
          ordem: params.ordem || 'DESC',
          ordenarPor: params.ordenarPor || 'ano',
        },
        {
          enableCache: true,
          cacheDuration: 3 * 60 * 1000, // 3 minutos - dados financeiros mudam mais
        }
      );

      // Simplificar despesas
      return (response.dados || []).map(item => ({
        mes: Number(item.mes),
        ano: Number(item.ano),
        categoria: item.tipoDespesa || "",
        valor: Number(item.valorDocumento || 0),
        fornecedor: item.fornec?.nomeFornecedor || "",
      }));
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      throw new Error(`Falha ao buscar despesas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Busca votações de um deputado
    * Endpoint: GET /deputados/{id}/votacoes
    */
  static async getDeputyVotes(id: string, params: {
    itens?: number;
    pagina?: number;
  } = {}): Promise<any[]> {
    try {
      const endpoint = `/deputados/${id}/votacoes`;

      const response = await httpClient.get<CamaraApiResponse<any>>(
        endpoint,
        {
          itens: params.itens || 20,
          pagina: params.pagina || 1,
        },
        {
          enableCache: true,
          cacheDuration: 5 * 60 * 1000, // 5 minutos
        }
      );

      return response.dados || [];
    } catch (error) {
      console.error('Erro ao buscar votações:', error);
      throw new Error(`Falha ao buscar votações: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Função auxiliar para busca combinada (usada na página principal)
    */
  static async searchWithFilters(params: {
    query?: string;
    partido?: string;
    uf?: string;
    itens?: number;
  } = {}): Promise<Deputy[]> {
    return this.searchDeputies({
      nome: params.query,
      siglaPartido: params.partido,
      siglaUf: params.uf,
      itens: params.itens,
    });
  }

  /**
    * Limpa cache da API para forçar atualização
    */
  static clearCache(): void {
    httpClient.clearCache();
  }

  /**
     * Verifica se a API está disponível
     */
  static async healthCheck(): Promise<boolean> {
    try {
      await httpClient.get('/api/deputados', {}, { enableCache: false });
      return true;
    } catch (error) {
      console.error('API indisponível:', error);
      return false;
    }
  }
}

// Exportar funções individuais para facilitar uso
export const {
  searchDeputies,
  getDeputyById,
  getDeputyProposals,
  getDeputyExpenses,
  getDeputyVotes,
  searchWithFilters,
  clearCache,
  healthCheck,
} = CamaraAPI;
