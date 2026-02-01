'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Building2, Mail, Phone, Calendar, GraduationCap, Users, FileText, DollarSign, Vote, TrendingUp, User, ChevronLeft, ChevronRight, FileCheck, Twitter, Instagram, Facebook, Youtube } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CamaraAPI } from "@/services/camara-api";
import type { Deputy, Comissao, CareerEvent, Proposicao } from "@/data/mockDeputies";
import { ExpenseChart } from "@/components/charts/ExpenseChart";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { cn } from "@/lib/utils";

export default function DeputyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deputy, setDeputy] = useState<Deputy | null>(null);
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [carreira, setCarreira] = useState<CareerEvent[]>([]);
  const [proposicoes, setProposicoes] = useState<Proposicao[]>([]);
  const [selectedProposicao, setSelectedProposicao] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposicoesPage, setProposicoesPage] = useState(1);
  const [presencaData, setPresencaData] = useState<{
    sessoes: number;
    presencas: number;
    ausenciasJustificadas: number;
    ausenciasNaoJustificadas: number;
  }>({ sessoes: 0, presencas: 0, ausenciasJustificadas: 0, ausenciasNaoJustificadas: 0 });
  const [votingData, setVotingData] = useState<{
    total: number;
    presentes: number;
    ausentes: number;
    abstencoes: number;
  }>({ total: 0, presentes: 0, ausentes: 0, abstencoes: 0 });
  const proposicoesPerPage = 10;

  useEffect(() => {
    const fetchDeputy = async () => {
      if (!params.id) return;

      try {
        const [deputyData, orgaosData, historicoData, proposicoesData, presenca, votacoes] = await Promise.all([
          CamaraAPI.getDeputyById(params.id as string),
          CamaraAPI.getDeputyOrgaos(params.id as string),
          CamaraAPI.getDeputyHistorico(params.id as string),
          CamaraAPI.getDeputyProposals(params.id as string),
          CamaraAPI.getDeputyPresence(params.id as string),
          CamaraAPI.getDeputyVotingStats(params.id as string),
        ]);

        if (deputyData) {
          setDeputy(deputyData);
          setComissoes(orgaosData);
          setCarreira(historicoData);
          setProposicoes(proposicoesData);
          setPresencaData(presenca);
          setVotingData(votacoes);
          setProposicoesPage(1);
        } else {
          setError("Deputado não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar dados do deputados:", err);
        setError("Erro ao carregar dados do deputados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeputy();
  }, [params.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-6"></div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !deputy) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              {error || "Deputado não encontrado"}
            </h1>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const situacaoStyles = {
    "Exercício": "bg-status-approved text-status-approved-foreground",
    "Afastado": "bg-status-pending text-status-pending-foreground",
    "Licenciado": "bg-status-archived text-status-archived-foreground",
  };

  const statusStyles = {
    "Aprovada": "status-approved",
    "Em Tramitação": "status-pending",
    "Arquivada": "status-archived",
    "Rejeitada": "status-rejected",
  };

  const totalExpenses = deputy.despesas.reduce((sum, d) => sum + d.valor, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Photo and basic info */}
            <div className="md:col-span-1 sticky top-24 self-start">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    {/* Use the shared Avatar component so image treatment matches search cards */}
                    <div className="mx-auto mb-4">
                    <Avatar className="w-[140px] h-[186px] mx-auto">
                        {deputy.foto ? (
                          <AvatarImage src={deputy.foto} alt={`Foto de ${deputy.nome}`} className="object-cover object-center h-full w-full" />
                        ) : (
                          <AvatarFallback className="bg-muted">
                            <User className="h-16 w-16 text-muted-foreground/40" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      {deputy.nome}
                    </h1>
                    
                    <div className="flex justify-center gap-2 mb-4">
                      <Badge variant="outline" className="font-semibold">
                        {deputy.partido}
                      </Badge>
                      <Badge className={situacaoStyles[deputy.situacao]}>
                        {deputy.situacao}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {deputy.uf}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        Deputado Federal
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed information */}
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="visao geral" className="space-y-6">
                <TabsList className="flex-wrap h-auto p-1">
                  <TabsTrigger value="visao geral">Visão Geral</TabsTrigger>
                  <TabsTrigger value="proposicoes">Proposições</TabsTrigger>
                  <TabsTrigger value="contato">Contato</TabsTrigger>
                </TabsList>

                <TabsContent value="visao geral" className="space-y-6">
                  {/* Two column layout: Personal Info and Commissions */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Informações Pessoais
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {deputy.dataNascimento && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Nascimento: {deputy.dataNascimento}
                              </span>
                            </div>
                          )}
                          {deputy.naturalidade && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Naturalidade: {deputy.naturalidade}
                              </span>
                            </div>
                          )}
                          {deputy.escolaridade && (
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Escolaridade: {deputy.escolaridade}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Legislature: {deputy.legislatura}ª
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              UF: {deputy.uf}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Commissions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5" />
                          Comissões
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {comissoes.length > 0 ? (
                          <div className="space-y-3">
                            {comissoes.map((comissao, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                <div>
                                  <p className="text-sm font-medium">{comissao.nome}</p>
                                  {comissao.sigla && (
                                    <p className="text-xs text-muted-foreground">{comissao.sigla}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Nenhuma comissão encontrada
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Political Career with Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Carreira Política
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
                        {(carreira.length > 0 ? carreira : deputy.carreira).map((e, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[29px] h-4 w-4 rounded-full bg-primary" />
                            <p className="text-sm text-primary font-semibold">{e.ano}</p>
                            <p className="font-medium">{e.cargo}</p>
                            <p className="text-sm text-muted-foreground">
                              {e.descricao.replace('null - null', 'Sem informações disponíveis').replace('null', 'Não informado')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="proposicoes">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Proposições Legislativas</CardTitle></CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Ementa</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const startIndex = (proposicoesPage - 1) * proposicoesPerPage;
                            const endIndex = startIndex + proposicoesPerPage;
                            const paginatedProposicoes = proposicoes.slice(startIndex, endIndex);
                            const totalPages = Math.ceil(proposicoes.length / proposicoesPerPage);

                            return paginatedProposicoes.length > 0 ? paginatedProposicoes.map((p) => (
                              <TableRow 
                                key={p.id} 
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={async () => {
                                  const detail = await CamaraAPI.getProposicaoDetail(p.id);
                                  setSelectedProposicao(detail);
                                }}
                              >
                                <TableCell className="font-medium">{p.tipo} {p.numero}/{p.ano}</TableCell>
                                <TableCell className="max-w-md truncate">{p.ementa}</TableCell>
                              </TableRow>
                            )) : (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground">
                                  Nenhuma proposição encontrada
                                </TableCell>
                              </TableRow>
                            );
                          })()}
                        </TableBody>
                      </Table>
                      
                      {proposicoes.length > proposicoesPerPage && (() => {
                        const totalPages = Math.ceil(proposicoes.length / proposicoesPerPage);
                        return (
                          <div className="flex items-center justify-center gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setProposicoesPage(p => Math.max(1, p - 1))}
                              disabled={proposicoesPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              Página {proposicoesPage} de {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setProposicoesPage(p => Math.min(totalPages, p + 1))}
                              disabled={proposicoesPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contato" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Gabinete
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {deputy.gabinete?.sala && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Sala: {deputy.gabinete.sala}
                              {deputy.gabinete.predio && ` - ${deputy.gabinete.predio}`}
                              {deputy.gabinete.andar && ` (${deputy.gabinete.andar}º andar)`}
                            </span>
                          </div>
                        )}
                        {deputy.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{deputy.telefone}</span>
                          </div>
                        )}
                        {deputy.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{deputy.email}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Redes Sociais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const socialIcons: Record<string, React.ReactNode> = {
                            twitter: <Twitter className="h-4 w-4" />,
                            instagram: <Instagram className="h-4 w-4" />,
                            facebook: <Facebook className="h-4 w-4" />,
                            youtube: <Youtube className="h-4 w-4" />,
                          };
                          
                          const socialNames: Record<string, string> = {
                            twitter: 'Twitter',
                            instagram: 'Instagram',
                            facebook: 'Facebook',
                            youtube: 'YouTube',
                          };

                          const entries = Object.entries(deputy.redesSociais || {}).filter(([, url]) => url);
                          
                          return entries.length > 0 ? entries.map(([plataforma, url]) => (
                            <a
                              key={plataforma}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                              {socialIcons[plataforma]}
                              <span className="text-sm font-medium">{socialNames[plataforma]}</span>
                            </a>
                          )) : (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma rede social disponível
                            </p>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Proposicao Detail Modal */}
      <Dialog open={!!selectedProposicao} onOpenChange={() => setSelectedProposicao(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProposicao?.siglaTipo} {selectedProposicao?.numero}/{selectedProposicao?.ano}
            </DialogTitle>
            <DialogDescription>
              {selectedProposicao?.descricaoTipo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedProposicao?.ementa && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Ementa</h4>
                <p className="text-sm">{selectedProposicao.ementa}</p>
              </div>
            )}
            {selectedProposicao?.ementaDetalhada && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Ementa Detalhada</h4>
                <p className="text-sm">{selectedProposicao.ementaDetalhada}</p>
              </div>
            )}
            {selectedProposicao?.keywords && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Palavras-chave</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedProposicao.keywords.split(',').map((keyword: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {keyword.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {selectedProposicao?.statusProposicao && (
              <>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Situação</h4>
                    <p className="text-sm">{selectedProposicao.statusProposicao.descricaoSituacao}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Órgão</h4>
                    <p className="text-sm">{selectedProposicao.statusProposicao.siglaOrgao}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Regime</h4>
                    <p className="text-sm">{selectedProposicao.statusProposicao.regime}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Apreciação</h4>
                    <p className="text-sm">{selectedProposicao.statusProposicao.apreciacao}</p>
                  </div>
                </div>
                {selectedProposicao.statusProposicao.despacho && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Último Despacho</h4>
                    <p className="text-sm">{selectedProposicao.statusProposicao.despacho}</p>
                  </div>
                )}
              </>
            )}
            {selectedProposicao?.urlInteiroTeor && (
              <div className="pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedProposicao.urlInteiroTeor} target="_blank" rel="noopener noreferrer">
                    Ver Inteiro Teor
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
