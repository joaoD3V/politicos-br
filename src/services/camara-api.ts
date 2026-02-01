import { httpClient } from './api-client';
import {
  CamaraApiResponse,
  CamaraDeputado,
  CamaraOrgao,
  CamaraHistorico,
  DeputadosSearchParams,
  mapCamaraDeputyToLocal,
  mapCamaraOrgaoToLocal,
  mapCamaraHistoricoToLocal,
} from '@/types/api-responses';
import { Deputy, Proposicao, Despesa, CareerEvent, Comissao } from '@/data/mockDeputies';

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
    * Busca proposições legislativas de um deputados
    * Endpoint: GET /api/proposicoes?idDeputadoAutor={id}
    */
  static async getDeputyProposals(id: string, params: {
    itens?: number;
    pagina?: number;
    ordem?: string;
  } = {}): Promise<Proposicao[]> {
    try {
      const response = await httpClient.get<any>(
        this.BASE_PATHS.PROPOSICOES,
        {
          idDeputadoAutor: parseInt(id),
          itens: params.itens || 20,
          pagina: params.pagina || 1,
          ordem: params.ordem || 'DESC',
        },
        {
          enableCache: true,
          cacheDuration: 10 * 60 * 1000,
        }
      );

      return (response.dados || []).slice(0, 20).map((item: any) => ({
        id: item.id.toString(),
        tipo: item.siglaTipo || "",
        numero: item.numero,
        ano: item.ano,
        ementa: item.ementa || "",
        status: "Em Tramitação",
        dataApresentacao: item.dataApresentacao || "",
      }));
    } catch (error) {
      console.error('Erro ao buscar proposições:', error);
      throw new Error(`Falha ao buscar proposições: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  static async getProposicaoDetail(id: string): Promise<any> {
    try {
      const response = await httpClient.get<any>(
        `/api/proposicoes/${id}`,
        {},
        { enableCache: true, cacheDuration: 30 * 60 * 1000 }
      );
      return response.dados || response;
    } catch (error) {
      console.error('Erro ao buscar detalhe da proposição:', error);
      throw new Error(`Falha ao buscar detalhe da proposição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Busca despesas parlamentares de um deputados
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

  /**
    * Busca comissões e órgãos de um deputado
    * Endpoint: GET /deputados/{id}/orgaos
    */
  static async getDeputyOrgaos(id: string): Promise<Comissao[]> {
    try {
      const endpoint = `/api/deputados/${id}/orgaos`;

      const response = await httpClient.get<CamaraApiResponse<CamaraOrgao>>(
        endpoint,
        {},
        {
          enableCache: true,
          cacheDuration: 10 * 60 * 1000, // 10 minutos
        }
      );

      return (response.dados || []).map(mapCamaraOrgaoToLocal);
    } catch (error) {
      console.error('Erro ao buscar órgãos:', error);
      throw new Error(`Falha ao buscar órgãos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Busca histórico parlamentar de um deputados
    * Endpoint: GET /deputados/{id}/historico
    */
  static async getDeputyHistorico(id: string): Promise<CareerEvent[]> {
    try {
      const endpoint = `/api/deputados/${id}/historico`;

      const response = await httpClient.get<CamaraApiResponse<CamaraHistorico>>(
        endpoint,
        {},
        {
          enableCache: true,
          cacheDuration: 10 * 60 * 1000, // 10 minutos
        }
      );

      return (response.dados || []).map(mapCamaraHistoricoToLocal);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error(`Falha ao buscar histórico: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
    * Busca estatísticas de presença de um deputados
    * Endpoint: GET /deputados/{id}/eventos
    */
  static async getDeputyPresence(id: string): Promise<{
    sessoes: number;
    presencas: number;
    ausenciasJustificadas: number;
    ausenciasNaoJustificadas: number;
  }> {
    try {
      const endpoint = `/api/deputados/${id}/eventos`;

      const response = await httpClient.get<CamaraApiResponse<any>>(
        endpoint,
        {
          itens: 100,
        },
        {
          enableCache: true,
          cacheDuration: 10 * 60 * 1000,
        }
      );

      const eventos = response.dados || [];
      
      let presencas = 0;
      let ausenciasJustificadas = 0;
      let ausenciasNaoJustificadas = 0;

      eventos.forEach((evento: any) => {
        const situacao = evento?.situacao?.toLowerCase() || '';
        if (situacao.includes('realizada') || situacao.includes('emandada')) {
          const frequencia = evento?.frequencia?.toLowerCase() || '';
          if (frequencia === 'presentes' || frequencia === 'presença') {
            presencas++;
          } else if (frequencia === 'ausência justificada') {
            ausenciasJustificadas++;
          } else if (frequencia === 'ausência') {
            ausenciasNaoJustificadas++;
          }
        }
      });

      const sessoes = presencas + ausenciasJustificadas + ausenciasNaoJustificadas;

      return {
        sessoes,
        presencas,
        ausenciasJustificadas,
        ausenciasNaoJustificadas,
      };
    } catch (error) {
      console.error('Erro ao buscar presença:', error);
      return {
        sessoes: 0,
        presencas: 0,
        ausenciasJustificadas: 0,
        ausenciasNaoJustificadas: 0,
      };
    }
  }

  /**
    * Busca estatísticas de votações de um deputados
    * Endpoint: GET /deputados/{id}/votacoes
    */
  static async getDeputyVotingStats(id: string): Promise<{
    total: number;
    presentes: number;
    ausentes: number;
    abstencoes: number;
  }> {
    // The /deputados/{id}/votacoes endpoint doesn't support GET requests
    // Return empty stats since voting data isn't available via API
    return {
      total: 0,
      presentes: 0,
      ausentes: 0,
      abstencoes: 0,
    };
  }
}

// Exportar funções individuais para facilitar uso
export const {
  searchDeputies,
  getDeputyById,
  getDeputyProposals,
  getDeputyExpenses,
  getDeputyVotes,
  getDeputyOrgaos,
  getDeputyHistorico,
  getDeputyPresence,
  getDeputyVotingStats,
  searchWithFilters,
  clearCache,
  healthCheck,
} = CamaraAPI;
