// Tipos baseados nas respostas da API Dados Abertos da Câmara dos Deputados
// Mapeamento para interface local utilizada no frontend

// Resposta base da API
export interface CamaraApiResponse<T> {
  dados: T[];
  links?: {
    self?: string;
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

// Detalhe de recurso (endpoint que retorna um objeto em `dados` ao invés de array)
export interface CamaraDetailResponse<T> {
  dados: T;
  links?: any[];
}

// Tipos específicos dos endpoints da API

export interface CamaraDeputado {
  id: number;
  uri: string;
  nome: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  uriUF: string;
  idLegislatura: number;
  urlFoto: string;
  data: string;
  email: string;
  situacao: string;
  condicaoEleitoral: string;
  descricaoStatus: string;
  cpf: string;
  sexo: string;
  dataNascimento: string;
  dataFalecimento?: string;
  ufNascimento: string;
  municipioNascimento: string;
  escolaridade: string;
  ultimaAtualizacao?: string;
  gabinete: {
    nome: string;
    predio: string;
    sala: string;
    andar: string;
    email?: string;
    telefone?: string;
  };
}

export interface CamaraProposicao {
  id: number;
  uri: string;
  siglaTipo: string;
  idTipo: number;
  descricaoTipo: string;
  numero: number;
  ano: number;
  ementa: string;
  idAutor: number;
  uriAutor: string;
  txtEmenta?: string;
  txtApelido?: string;
  keywords?: string;
  dataApresentacao: string;
  statusProposicao: {
    id: number;
    sigla: string;
    uri: string;
    descricao: string;
    dataHora: string;
    uriProposicaoPrincipal?: string;
  };
  uriAutores?: string;
  tipoProposicao: {
    id: number;
    sigla: string;
    nome: string;
    descricao: string;
  };
}

export interface CamaraVotacao {
  id: number;
  uri: string;
  dataHoraVotacao: string;
  uriVotacao: string;
  data: string;
  siglaTipoVotacao: string;
  descricaoTipoVotacao: string;
  siglaTipoResposta?: string;
  descricaoTipoResposta?: string;
  tipoResposta: {
    id: number;
    sigla: string;
    descricao: string;
  };
  uriEvento: string;
  tipoEvento: {
    id: number;
    sigla: string;
    descricao: string;
    uri: string;
  };
  plenario?: {
    uri: string;
    nome: string;
    uriExecutivo?: string;
  };
}

export interface CamaraDespesa {
  id: number;
  idDeputado: number;
  idTipoDocumento: number;
  tipoDocumento: string;
  tipoDespesa: string;
  tipoDocumentoFiscal: string;
  fornec: {
    cnpjCpfFornecedor: string;
    nomeFornecedor: string;
  };
  dataDocumento: string;
  numeroDocumento: string;
  ano: number;
  mes: number;
  tipoPessoa: string;
  valorDocumento: number;
  urlDocumento?: string;
  nomePassageiro?: string;
  trechoViagem?: string;
  numeroDeCartaoBeneficio?: string;
  numeroParcela?: number;
  valorLiquido?: number;
  valorGlosa?: number;
  numRessarcimento?: number;
  valorRessarcimento?: number;
  idLote: number;
  parcela?: number;
}

export interface CamaraEvento {
  id: number;
  uri: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  descricao: string;
  descricaoTipo: string;
  situacao: string;
  tipoEvento: {
    id: number;
    sigla: string;
    descricao: string;
    uri: string;
  };
  localExterno: boolean;
  localCamara: {
    nome: string;
    predic: string;
    sala: string;
  };
  descricaoPauta?: string;
  uriPauta?: string;
  urlRegistroPauta?: string;
}

export interface CamaraOrgao {
  idOrgao: number;
  uriOrgao: string;
  siglaOrgao: string;
  nomeOrgao: string;
  nomePublicacao: string;
  titulo: string;
  codTitulo: string;
  dataInicio: string;
  dataFim?: string;
}

export interface CamaraHistorico {
  id: number;
  uri: string;
  nome: string;
  nomeEleitoral: string;
  siglaPartido: string;
  uriPartido: string;
  siglaUf: string;
  idLegislatura: number;
  email: string | null;
  urlFoto: string;
  dataHora: string;
  situacao: string | null;
  condicaoEleitoral: string | null;
  descricaoStatus: string;
}

// Parâmetros de busca
export interface DeputadosSearchParams {
  nome?: string;
  siglaUf?: string;
  siglaPartido?: string;
  itens?: number;
  pagina?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: string;
}

export interface ProposicoesSearchParams {
  idAutor?: number;
  siglaTipo?: string;
  ano?: number;
  numero?: number;
  tramitacao?: string;
  siglaUfAutor?: string;
  itens?: number;
  pagina?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: 'id' | 'ano' | 'dataApresentacao' | 'siglaTipo';
}

export interface DespesasSearchParams {
  idDeputado?: number;
  ano?: number;
  mes?: number;
  cnpjCpfFornecedor?: string;
  tipoDespesa?: string;
  itens?: number;
  pagina?: number;
  ordem?: 'ASC' | 'DESC';
  ordenarPor?: 'ano' | 'mes' | 'tipoDespesa' | 'valorDocumento';
}

// Funções de mapeamento para compatibilidade com interface local existente
export interface CareerEvent {
  ano: number;
  cargo: string;
  descricao: string;
}

export interface Comissao {
  nome: string;
  sigla: string;
  tipo: string;
  titulo: string;
  dataInicio: string;
  dataFim?: string;
}

export interface VotingStats {
  total: number;
  presentes: number;
  ausentes: number;
  abstencoes: number;
}

export interface AttendanceStats {
  sessoes: number;
  presencas: number;
  ausenciasJustificadas: number;
  ausenciasNaoJustificadas: number;
}

export interface ApiError {
  message: string;
  status?: number;
  endpoint?: string;
  details?: any;
}

// Tipos de status padronizados
export type DeputyStatus = "Exercício" | "Afastado" | "Licenciado";
export type ProposalStatus = "Aprovada" | "Em Tramitação" | "Arquivada" | "Rejeitada";

// Funções de mapeamento
export function mapCamaraDeputyToLocal(deputado: CamaraDeputado | any) {
  // The API returns slightly different shapes between list and detail endpoints.
  // Be defensive and prefer deputado fields, then fall back to ultimoStatus (detail response).
  const u = deputado?.ultimoStatus ?? {};
  const gab = deputado?.gabinete ?? u?.gabinete ?? {};
  const redes = deputado?.redeSocial ?? [];

  const id = deputado?.id ?? deputado?.dados?.id ?? undefined;
  const nome = deputado?.nome ?? deputado?.nomeCivil ?? u?.nome ?? '';
  const partido = deputado?.siglaPartido ?? u?.siglaPartido ?? u?.partido ?? '';
  const uf = deputado?.siglaUf ?? u?.siglaUf ?? '';
  const foto = deputado?.urlFoto ?? u?.urlFoto ?? '';
  const email = gab?.email || '';
  const telefone = gab?.telefone || '';

  const redesSociaisObj = {
    twitter: redes.find((r: string) => r.includes('twitter')) || '',
    instagram: redes.find((r: string) => r.includes('instagram')) || '',
    facebook: redes.find((r: string) => r.includes('facebook')) || '',
    youtube: redes.find((r: string) => r.includes('youtube')) || '',
  };

  return {
    id: id ? String(id) : 'unknown',
    nome,
    nomeCompleto: nome,
    partido: partido || '',
    uf: uf || '',
    foto: foto || '',
    email,
    telefone,
    situacao: 'Exercício' as const,
    legislature: deputado?.idLegislatura ?? u?.idLegislatura ?? 0,
    dataNascimento: formatDate(deputado?.dataNascimento ?? deputado?.data ?? ''),
    naturalidade: deputado?.ufNascimento ? `${deputado.municipioNascimento} - ${deputado.ufNascimento}` : '',
    escolaridade: deputado?.escolaridade ?? u?.escolaridade ?? '',
    redesSociais: redesSociaisObj,
    gabinete: {
      sala: gab?.sala || '',
      predio: gab?.predio || '',
      andar: gab?.andar || '',
      telefone: gab?.telefone || '',
    },
    carreira: [],
    proposicoes: [],
    despesas: [],
    votacoes: { total: 0, presentes: 0, ausentes: 0, abstencoes: 0 },
    presenca: { sessoes: 0, presencas: 0, ausenciasJustificadas: 0, ausenciasNaoJustificadas: 0 },
    comissoes: [],
  };
}

export function mapCamaraProposicaoToLocal(proposicao: CamaraProposicao) {
  return {
    id: proposicao.id.toString(),
    tipo: proposicao.siglaTipo || "",
    numero: proposicao.numero,
    ano: proposicao.ano,
    ementa: proposicao.ementa || "",
    status: normalizeProposalStatus(proposicao.statusProposicao?.sigla) || "Em Tramitação",
    dataApresentacao: formatDate(proposicao.dataApresentacao),
  };
}

export function mapCamaraDespesaToLocal(despesa: CamaraDespesa) {
  return {
    mes: despesa.mes,
    ano: despesa.ano,
    categoria: despesa.tipoDespesa || "",
    valor: despesa.valorDocumento || 0,
    fornecedor: despesa.fornec?.nomeFornecedor || "",
  };
}

export function mapCamaraOrgaoToLocal(orgao: CamaraOrgao): Comissao {
  return {
    nome: orgao.nomePublicacao || orgao.nomeOrgao || "",
    sigla: orgao.siglaOrgao || "",
    tipo: orgao.codTitulo || "",
    titulo: orgao.titulo && orgao.titulo !== 'null' ? orgao.titulo : "",
    dataInicio: formatDate(orgao.dataInicio),
    dataFim: orgao.dataFim ? formatDate(orgao.dataFim) : undefined,
  };
}

export function mapCamaraHistoricoToLocal(historico: CamaraHistorico): CareerEvent {
  const dataParts = historico.dataHora?.split('T')[0].split('-') || [];
  const ano = dataParts[0] ? parseInt(dataParts[0]) : 0;
  const dataFormatada = dataParts.length === 3 
    ? `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}` 
    : '';

  const partido = historico.siglaPartido ? `(${historico.siglaPartido})` : '';
  const uf = historico.siglaUf ? `- ${historico.siglaUf}` : '';
  const condicao = historico.condicaoEleitoral && historico.condicaoEleitoral !== 'null' 
    ? historico.condicaoEleitoral 
    : '';

  return {
    ano,
    cargo: `${historico.idLegislatura}ª Legislature ${partido} ${uf}`.trim(),
    descricao: `${dataFormatada} - ${historico.descricaoStatus || 'Não informado'}`.trim(),
  };
}

// Funções utilitárias de normalização
function normalizeDeputyStatus(status: string): DeputyStatus {
  if (!status) return 'Exercício';
  
  const normalized = status.toLowerCase().trim();
  switch (normalized) {
    case 'exercício':
    case 'exercicio':
      return 'Exercício';
    case 'afastado':
      return 'Afastado';
    case 'licenciado':
      return 'Licenciado';
    default:
      return 'Exercício';
  }
}

function normalizeProposalStatus(status: string): ProposalStatus {
  const normalized = status?.toLowerCase().trim() || '';
  switch (normalized) {
    case 'aprovada':
      return 'Aprovada';
    case 'em tramitação':
    case 'em tramitacao':
    case 'tramitação':
    case 'tramitacao':
      return 'Em Tramitação';
    case 'arquivada':
      return 'Arquivada';
    case 'rejeitada':
      return 'Rejeitada';
    default:
      return 'Em Tramitação';
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    // Formato esperado: YYYY-MM-DD ou DD/MM/YYYY
    if (dateString.includes('-')) {
      // YYYY-MM-DD
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } else if (dateString.includes('/')) {
      // DD/MM/YYYY
      return dateString;
    } else {
      // Tentar parse ISO
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    }
  } catch (error) {
    console.warn('Error parsing date:', dateString, error);
    return dateString;
  }
}
