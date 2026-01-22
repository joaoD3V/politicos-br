export interface Deputy {
  id: string;
  nome: string;
  nomeCompleto: string;
  partido: string;
  uf: string;
  foto: string;
  email: string;
  telefone: string;
  situacao: "Exercício" | "Afastado" | "Licenciado";
  legislatura: number;
  dataNascimento: string;
  naturalidade: string;
  escolaridade: string;
  redesSociais: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  gabinete: {
    sala: string;
    predio: string;
    andar: string;
    telefone: string;
  };
  carreira: CareerEvent[];
  proposicoes: Proposicao[];
  despesas: Despesa[];
  votacoes: VotingStats;
  presenca: AttendanceStats;
  comissoes: string[];
}

export interface CareerEvent {
  ano: number;
  cargo: string;
  descricao: string;
}

export interface Proposicao {
  id: string;
  tipo: string;
  numero: number;
  ano: number;
  ementa: string;
  status: "Aprovada" | "Em Tramitação" | "Arquivada" | "Rejeitada";
  dataApresentacao: string;
}

export interface Despesa {
  mes: number;
  ano: number;
  categoria: string;
  valor: number;
  fornecedor: string;
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

export const partidos = [
  "PT", "PL", "UNIÃO", "PP", "MDB", "PSD", "REPUBLICANOS", 
  "PDT", "PSDB", "PSB", "PODEMOS", "PSOL", "PCdoB", "NOVO",
  "AVANTE", "SOLIDARIEDADE", "CIDADANIA", "PV", "REDE"
];

export const estados = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

const generateExpenses = (deputyId: string): Despesa[] => {
  const categorias = [
    "Combustíveis e Lubrificantes",
    "Passagens Aéreas",
    "Telefonia",
    "Serviços Postais",
    "Manutenção de Escritório",
    "Divulgação da Atividade Parlamentar",
    "Alimentação",
    "Hospedagem",
    "Locação de Veículos",
    "Consultorias"
  ];
  
  const despesas: Despesa[] = [];
  const fornecedores = [
    "Auto Posto Central", "Latam Airlines", "Tim Celular", 
    "Correios", "Imobiliária Central", "Gráfica Nacional",
    "Restaurante Plenário", "Hotel Brasília Palace", "Localiza",
    "Consultoria Jurídica Associados"
  ];
  
  for (let ano = 2023; ano <= 2024; ano++) {
    for (let mes = 1; mes <= 12; mes++) {
      if (ano === 2024 && mes > 10) continue;
      
      const numDespesas = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < numDespesas; i++) {
        const catIndex = Math.floor(Math.random() * categorias.length);
        despesas.push({
          mes,
          ano,
          categoria: categorias[catIndex],
          valor: Math.floor(Math.random() * 15000) + 500,
          fornecedor: fornecedores[catIndex]
        });
      }
    }
  }
  
  return despesas;
};

const generateProposicoes = (deputyId: string): Proposicao[] => {
  const tipos = ["PL", "PEC", "PLP", "PDL", "REQ"];
  const statusOptions: Proposicao["status"][] = ["Aprovada", "Em Tramitação", "Arquivada", "Rejeitada"];
  const ementas = [
    "Altera a legislação tributária para redução de impostos sobre medicamentos essenciais",
    "Institui o Programa Nacional de Inclusão Digital nas Escolas Públicas",
    "Estabelece normas para proteção de dados pessoais em transações comerciais",
    "Cria incentivos fiscais para empresas que adotarem práticas sustentáveis",
    "Regulamenta o trabalho remoto e estabelece direitos dos trabalhadores",
    "Institui o Dia Nacional da Transparência Pública",
    "Altera o Código de Trânsito Brasileiro para aumentar penalidades",
    "Estabelece diretrizes para a política nacional de segurança alimentar",
    "Cria o Fundo Nacional de Apoio à Cultura Regional",
    "Regulamenta a atividade de influenciadores digitais"
  ];
  
  const proposicoes: Proposicao[] = [];
  const numProposicoes = Math.floor(Math.random() * 8) + 5;
  
  for (let i = 0; i < numProposicoes; i++) {
    proposicoes.push({
      id: `${deputyId}-prop-${i}`,
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      numero: Math.floor(Math.random() * 5000) + 100,
      ano: Math.floor(Math.random() * 4) + 2021,
      ementa: ementas[Math.floor(Math.random() * ementas.length)],
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      dataApresentacao: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 4) + 2021}`
    });
  }
  
  return proposicoes;
};

const generateCareer = (): CareerEvent[] => {
  const eventos: CareerEvent[] = [];
  const cargos = [
    { cargo: "Vereador", desc: "Câmara Municipal" },
    { cargo: "Deputado Estadual", desc: "Assembleia Legislativa" },
    { cargo: "Secretário Municipal", desc: "Secretaria de Educação" },
    { cargo: "Deputado Federal", desc: "Câmara dos Deputados - 1º Mandato" },
    { cargo: "Deputado Federal", desc: "Câmara dos Deputados - 2º Mandato" },
  ];
  
  let ano = 2004 + Math.floor(Math.random() * 8);
  const numEventos = Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < numEventos; i++) {
    const evento = cargos[Math.min(i, cargos.length - 1)];
    eventos.push({
      ano,
      cargo: evento.cargo,
      descricao: evento.desc
    });
    ano += 4;
  }
  
  eventos.push({
    ano: 2023,
    cargo: "Deputado Federal",
    descricao: "Câmara dos Deputados - Legislatura Atual"
  });
  
  return eventos;
};

export const mockDeputies: Deputy[] = [
  {
    id: "1",
    nome: "Maria Silva Santos",
    nomeCompleto: "Maria Aparecida da Silva Santos",
    partido: "PT",
    uf: "SP",
    foto: "",
    email: "dep.mariasilva@camara.leg.br",
    telefone: "(61) 3215-1001",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "15/03/1975",
    naturalidade: "São Paulo - SP",
    escolaridade: "Superior Completo - Direito",
    redesSociais: {
      twitter: "https://twitter.com/mariasilva",
      instagram: "https://instagram.com/mariasilvaoficial",
      facebook: "https://facebook.com/depmariasilva"
    },
    gabinete: {
      sala: "412",
      predio: "Anexo IV",
      andar: "4º",
      telefone: "(61) 3215-1001"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("1"),
    despesas: generateExpenses("1"),
    votacoes: { total: 245, presentes: 230, ausentes: 10, abstencoes: 5 },
    presenca: { sessoes: 180, presencas: 172, ausenciasJustificadas: 5, ausenciasNaoJustificadas: 3 },
    comissoes: ["Comissão de Educação", "Comissão de Direitos Humanos", "Comissão de Trabalho"]
  },
  {
    id: "2",
    nome: "João Pedro Oliveira",
    nomeCompleto: "João Pedro de Oliveira Costa",
    partido: "PL",
    uf: "RJ",
    foto: "",
    email: "dep.joaopedro@camara.leg.br",
    telefone: "(61) 3215-1002",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "22/08/1968",
    naturalidade: "Rio de Janeiro - RJ",
    escolaridade: "Superior Completo - Economia",
    redesSociais: {
      twitter: "https://twitter.com/joaopedrodep",
      instagram: "https://instagram.com/joaopedrooficial",
      youtube: "https://youtube.com/@joaopedrodep"
    },
    gabinete: {
      sala: "523",
      predio: "Anexo III",
      andar: "5º",
      telefone: "(61) 3215-1002"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("2"),
    despesas: generateExpenses("2"),
    votacoes: { total: 245, presentes: 210, ausentes: 25, abstencoes: 10 },
    presenca: { sessoes: 180, presencas: 165, ausenciasJustificadas: 10, ausenciasNaoJustificadas: 5 },
    comissoes: ["Comissão de Economia", "Comissão de Finanças", "Comissão de Agricultura"]
  },
  {
    id: "3",
    nome: "Ana Carolina Ferreira",
    nomeCompleto: "Ana Carolina Ferreira de Souza",
    partido: "UNIÃO",
    uf: "MG",
    foto: "",
    email: "dep.anacarolina@camara.leg.br",
    telefone: "(61) 3215-1003",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "10/12/1982",
    naturalidade: "Belo Horizonte - MG",
    escolaridade: "Mestrado - Administração Pública",
    redesSociais: {
      instagram: "https://instagram.com/anacarolinadep",
      facebook: "https://facebook.com/anacarolinaferreira"
    },
    gabinete: {
      sala: "234",
      predio: "Anexo IV",
      andar: "2º",
      telefone: "(61) 3215-1003"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("3"),
    despesas: generateExpenses("3"),
    votacoes: { total: 245, presentes: 240, ausentes: 3, abstencoes: 2 },
    presenca: { sessoes: 180, presencas: 178, ausenciasJustificadas: 2, ausenciasNaoJustificadas: 0 },
    comissoes: ["Comissão de Administração", "Comissão de Fiscalização", "Comissão de Meio Ambiente"]
  },
  {
    id: "4",
    nome: "Carlos Eduardo Lima",
    nomeCompleto: "Carlos Eduardo Lima da Costa",
    partido: "MDB",
    uf: "RS",
    foto: "",
    email: "dep.carloseduardo@camara.leg.br",
    telefone: "(61) 3215-1004",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "05/07/1970",
    naturalidade: "Porto Alegre - RS",
    escolaridade: "Superior Completo - Medicina",
    redesSociais: {
      twitter: "https://twitter.com/carloseduardomed",
      instagram: "https://instagram.com/carloseduardolima"
    },
    gabinete: {
      sala: "678",
      predio: "Anexo III",
      andar: "6º",
      telefone: "(61) 3215-1004"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("4"),
    despesas: generateExpenses("4"),
    votacoes: { total: 245, presentes: 220, ausentes: 20, abstencoes: 5 },
    presenca: { sessoes: 180, presencas: 168, ausenciasJustificadas: 8, ausenciasNaoJustificadas: 4 },
    comissoes: ["Comissão de Saúde", "Comissão de Seguridade Social", "Comissão de Ciência e Tecnologia"]
  },
  {
    id: "5",
    nome: "Fernanda Rodrigues",
    nomeCompleto: "Fernanda Rodrigues de Almeida",
    partido: "PSOL",
    uf: "PE",
    foto: "",
    email: "dep.fernandarodrigues@camara.leg.br",
    telefone: "(61) 3215-1005",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "28/01/1985",
    naturalidade: "Recife - PE",
    escolaridade: "Doutorado - Sociologia",
    redesSociais: {
      twitter: "https://twitter.com/fernandapsol",
      instagram: "https://instagram.com/fernandarodriguesoficial",
      youtube: "https://youtube.com/@fernandarodriguesdep"
    },
    gabinete: {
      sala: "156",
      predio: "Anexo IV",
      andar: "1º",
      telefone: "(61) 3215-1005"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("5"),
    despesas: generateExpenses("5"),
    votacoes: { total: 245, presentes: 238, ausentes: 5, abstencoes: 2 },
    presenca: { sessoes: 180, presencas: 176, ausenciasJustificadas: 3, ausenciasNaoJustificadas: 1 },
    comissoes: ["Comissão de Direitos Humanos", "Comissão de Cultura", "Comissão de Defesa do Consumidor"]
  },
  {
    id: "6",
    nome: "Roberto Nascimento",
    nomeCompleto: "Roberto Carlos do Nascimento",
    partido: "PP",
    uf: "BA",
    foto: "",
    email: "dep.robertonascimento@camara.leg.br",
    telefone: "(61) 3215-1006",
    situacao: "Licenciado",
    legislatura: 57,
    dataNascimento: "14/09/1965",
    naturalidade: "Salvador - BA",
    escolaridade: "Superior Completo - Engenharia Civil",
    redesSociais: {
      facebook: "https://facebook.com/robertonascimentodep"
    },
    gabinete: {
      sala: "789",
      predio: "Anexo III",
      andar: "7º",
      telefone: "(61) 3215-1006"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("6"),
    despesas: generateExpenses("6"),
    votacoes: { total: 150, presentes: 140, ausentes: 8, abstencoes: 2 },
    presenca: { sessoes: 120, presencas: 110, ausenciasJustificadas: 8, ausenciasNaoJustificadas: 2 },
    comissoes: ["Comissão de Infraestrutura", "Comissão de Desenvolvimento Urbano"]
  },
  {
    id: "7",
    nome: "Patrícia Mendes",
    nomeCompleto: "Patrícia de Souza Mendes",
    partido: "PSD",
    uf: "PR",
    foto: "",
    email: "dep.patriciamendes@camara.leg.br",
    telefone: "(61) 3215-1007",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "03/04/1978",
    naturalidade: "Curitiba - PR",
    escolaridade: "Superior Completo - Jornalismo",
    redesSociais: {
      twitter: "https://twitter.com/patriciamendesdep",
      instagram: "https://instagram.com/patriciamendes"
    },
    gabinete: {
      sala: "345",
      predio: "Anexo IV",
      andar: "3º",
      telefone: "(61) 3215-1007"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("7"),
    despesas: generateExpenses("7"),
    votacoes: { total: 245, presentes: 235, ausentes: 8, abstencoes: 2 },
    presenca: { sessoes: 180, presencas: 175, ausenciasJustificadas: 4, ausenciasNaoJustificadas: 1 },
    comissoes: ["Comissão de Comunicação", "Comissão de Turismo", "Comissão de Esporte"]
  },
  {
    id: "8",
    nome: "Marcos Antônio Ribeiro",
    nomeCompleto: "Marcos Antônio Ribeiro da Silva",
    partido: "REPUBLICANOS",
    uf: "GO",
    foto: "",
    email: "dep.marcosribeiro@camara.leg.br",
    telefone: "(61) 3215-1008",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "19/11/1972",
    naturalidade: "Goiânia - GO",
    escolaridade: "Superior Completo - Administração",
    redesSociais: {
      instagram: "https://instagram.com/marcosribeirooficial"
    },
    gabinete: {
      sala: "567",
      predio: "Anexo III",
      andar: "5º",
      telefone: "(61) 3215-1008"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("8"),
    despesas: generateExpenses("8"),
    votacoes: { total: 245, presentes: 225, ausentes: 15, abstencoes: 5 },
    presenca: { sessoes: 180, presencas: 170, ausenciasJustificadas: 7, ausenciasNaoJustificadas: 3 },
    comissoes: ["Comissão de Agricultura", "Comissão de Integração Nacional"]
  },
  {
    id: "9",
    nome: "Luciana Barbosa",
    nomeCompleto: "Luciana Maria Barbosa",
    partido: "PDT",
    uf: "CE",
    foto: "",
    email: "dep.lucianabarbosa@camara.leg.br",
    telefone: "(61) 3215-1009",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "08/06/1980",
    naturalidade: "Fortaleza - CE",
    escolaridade: "Superior Completo - Pedagogia",
    redesSociais: {
      twitter: "https://twitter.com/lucianabarbosadep",
      instagram: "https://instagram.com/lucianabarbosaoficial",
      facebook: "https://facebook.com/depbarbosa"
    },
    gabinete: {
      sala: "234",
      predio: "Anexo IV",
      andar: "2º",
      telefone: "(61) 3215-1009"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("9"),
    despesas: generateExpenses("9"),
    votacoes: { total: 245, presentes: 242, ausentes: 2, abstencoes: 1 },
    presenca: { sessoes: 180, presencas: 179, ausenciasJustificadas: 1, ausenciasNaoJustificadas: 0 },
    comissoes: ["Comissão de Educação", "Comissão de Família", "Comissão da Mulher"]
  },
  {
    id: "10",
    nome: "Thiago Carvalho",
    nomeCompleto: "Thiago de Carvalho Pereira",
    partido: "NOVO",
    uf: "SC",
    foto: "",
    email: "dep.thiagocarvalho@camara.leg.br",
    telefone: "(61) 3215-1010",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "25/02/1988",
    naturalidade: "Florianópolis - SC",
    escolaridade: "MBA - Gestão Empresarial",
    redesSociais: {
      twitter: "https://twitter.com/thiagonovo",
      instagram: "https://instagram.com/thiagocarvalhooficial",
      youtube: "https://youtube.com/@thiagocarvalhodep"
    },
    gabinete: {
      sala: "123",
      predio: "Anexo IV",
      andar: "1º",
      telefone: "(61) 3215-1010"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("10"),
    despesas: generateExpenses("10"),
    votacoes: { total: 245, presentes: 244, ausentes: 1, abstencoes: 0 },
    presenca: { sessoes: 180, presencas: 180, ausenciasJustificadas: 0, ausenciasNaoJustificadas: 0 },
    comissoes: ["Comissão de Finanças", "Comissão de Economia", "Comissão de Privatizações"]
  },
  {
    id: "11",
    nome: "Adriana Costa",
    nomeCompleto: "Adriana Costa Ferreira",
    partido: "PSB",
    uf: "AM",
    foto: "",
    email: "dep.adrianacosta@camara.leg.br",
    telefone: "(61) 3215-1011",
    situacao: "Exercício",
    legislatura: 57,
    dataNascimento: "12/10/1976",
    naturalidade: "Manaus - AM",
    escolaridade: "Superior Completo - Biologia",
    redesSociais: {
      instagram: "https://instagram.com/adrianacostaoficial"
    },
    gabinete: {
      sala: "456",
      predio: "Anexo III",
      andar: "4º",
      telefone: "(61) 3215-1011"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("11"),
    despesas: generateExpenses("11"),
    votacoes: { total: 245, presentes: 230, ausentes: 12, abstencoes: 3 },
    presenca: { sessoes: 180, presencas: 170, ausenciasJustificadas: 8, ausenciasNaoJustificadas: 2 },
    comissoes: ["Comissão de Meio Ambiente", "Comissão da Amazônia", "Comissão de Povos Indígenas"]
  },
  {
    id: "12",
    nome: "Paulo Henrique Martins",
    nomeCompleto: "Paulo Henrique de Souza Martins",
    partido: "PSDB",
    uf: "SP",
    foto: "",
    email: "dep.paulohenrique@camara.leg.br",
    telefone: "(61) 3215-1012",
    situacao: "Afastado",
    legislatura: 57,
    dataNascimento: "30/05/1963",
    naturalidade: "Campinas - SP",
    escolaridade: "Doutorado - Ciência Política",
    redesSociais: {
      twitter: "https://twitter.com/paulohenriquedep",
      facebook: "https://facebook.com/paulohenriquemartins"
    },
    gabinete: {
      sala: "890",
      predio: "Anexo III",
      andar: "8º",
      telefone: "(61) 3215-1012"
    },
    carreira: generateCareer(),
    proposicoes: generateProposicoes("12"),
    despesas: generateExpenses("12"),
    votacoes: { total: 100, presentes: 95, ausentes: 4, abstencoes: 1 },
    presenca: { sessoes: 80, presencas: 75, ausenciasJustificadas: 5, ausenciasNaoJustificadas: 0 },
    comissoes: ["Comissão de Relações Exteriores", "Comissão de Defesa Nacional"]
  }
];

export const getDeputyById = (id: string): Deputy | undefined => {
  return mockDeputies.find(d => d.id === id);
};

export const searchDeputies = (
  query: string = "",
  filters: {
    partido?: string;
    uf?: string;
    situacao?: string;
  } = {}
): Deputy[] => {
  let results = [...mockDeputies];
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(d => 
      d.nome.toLowerCase().includes(lowerQuery) ||
      d.nomeCompleto.toLowerCase().includes(lowerQuery) ||
      d.partido.toLowerCase().includes(lowerQuery)
    );
  }
  
  if (filters.partido) {
    results = results.filter(d => d.partido === filters.partido);
  }
  
  if (filters.uf) {
    results = results.filter(d => d.uf === filters.uf);
  }
  
  if (filters.situacao) {
    results = results.filter(d => d.situacao === filters.situacao);
  }
  
  return results;
};

export const getExpensesByCategory = (despesas: Despesa[]): { name: string; value: number }[] => {
  const categorySums: Record<string, number> = {};
  
  despesas.forEach(d => {
    if (categorySums[d.categoria]) {
      categorySums[d.categoria] += d.valor;
    } else {
      categorySums[d.categoria] = d.valor;
    }
  });
  
  return Object.entries(categorySums)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getExpensesByMonth = (despesas: Despesa[], year: number): { month: string; valor: number }[] => {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyData = months.map((month, index) => ({
    month,
    valor: despesas
      .filter(d => d.ano === year && d.mes === index + 1)
      .reduce((sum, d) => sum + d.valor, 0)
  }));
  
  return monthlyData;
};
