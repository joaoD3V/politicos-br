import { useParams, Link } from "react-router-dom";
import { User, MapPin, Building2, Mail, Phone, GraduationCap, Calendar, ArrowLeft, Twitter, Instagram, Facebook, Youtube } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpensesPieChart } from "@/components/charts/ExpensesPieChart";
import { ExpensesBarChart } from "@/components/charts/ExpensesBarChart";
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { EmptyState } from "@/components/ui/empty-state";
import { getDeputyById, getExpensesByCategory, getExpensesByMonth } from "@/data/mockDeputies";
import { cn } from "@/lib/utils";

const statusStyles = {
  "Aprovada": "status-approved",
  "Em Tramitação": "status-pending",
  "Arquivada": "status-archived",
  "Rejeitada": "status-rejected",
};

export default function DeputyProfile() {
  const { id } = useParams<{ id: string }>();
  const deputy = getDeputyById(id || "");

  if (!deputy) {
    return (
      <Layout>
        <div className="container py-16">
          <EmptyState title="Deputado não encontrado" description="O deputado solicitado não existe ou foi removido">
            <Button asChild><Link to="/buscar">Voltar à Busca</Link></Button>
          </EmptyState>
        </div>
      </Layout>
    );
  }

  const expensesByCategory = getExpensesByCategory(deputy.despesas);
  const expensesByMonth = getExpensesByMonth(deputy.despesas, 2024);
  const totalExpenses = deputy.despesas.reduce((sum, d) => sum + d.valor, 0);

  return (
    <Layout>
      <div className="container py-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/buscar"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link>
        </Button>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <User className="h-12 w-12 text-muted-foreground/40" />
          </div>
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-semibold">{deputy.partido}</Badge>
              <Badge className={deputy.situacao === "Exercício" ? "status-approved" : "status-archived"}>{deputy.situacao}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{deputy.nomeCompleto}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{deputy.uf}</span>
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />Deputado Federal</span>
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{deputy.email}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="proposicoes">Proposições</TabsTrigger>
            <TabsTrigger value="atividade">Atividade</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
            <TabsTrigger value="contato">Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Informações Pessoais</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p><Calendar className="mr-2 inline h-4 w-4" />Nascimento: {deputy.dataNascimento}</p>
                  <p><MapPin className="mr-2 inline h-4 w-4" />Naturalidade: {deputy.naturalidade}</p>
                  <p><GraduationCap className="mr-2 inline h-4 w-4" />Formação: {deputy.escolaridade}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Comissões</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {deputy.comissoes.map((c, i) => <li key={i} className="text-sm text-muted-foreground">• {c}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle>Carreira Política</CardTitle></CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-primary/20 pl-6 space-y-6">
                  {deputy.carreira.map((e, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[29px] h-4 w-4 rounded-full bg-primary" />
                      <p className="text-sm text-primary font-semibold">{e.ano}</p>
                      <p className="font-medium">{e.cargo}</p>
                      <p className="text-sm text-muted-foreground">{e.descricao}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proposicoes">
            <Card>
              <CardHeader><CardTitle>Proposições Legislativas</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Ementa</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deputy.proposicoes.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.tipo} {p.numero}/{p.ano}</TableCell>
                        <TableCell className="max-w-md">{p.ementa}</TableCell>
                        <TableCell><Badge className={cn("text-xs", statusStyles[p.status])}>{p.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="atividade">
            <div className="grid gap-6 md:grid-cols-2">
              <AttendanceChart attendance={deputy.presenca} voting={deputy.votacoes} />
              <Card>
                <CardHeader><CardTitle>Resumo de Presença</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between"><span>Total de Sessões</span><span className="font-semibold">{deputy.presenca.sessoes}</span></div>
                  <div className="flex justify-between"><span>Presenças</span><span className="font-semibold text-status-approved">{deputy.presenca.presencas}</span></div>
                  <div className="flex justify-between"><span>Ausências Justificadas</span><span>{deputy.presenca.ausenciasJustificadas}</span></div>
                  <div className="flex justify-between"><span>Ausências Não Justificadas</span><span className="text-destructive">{deputy.presenca.ausenciasNaoJustificadas}</span></div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="despesas">
            <Card className="mb-6">
              <CardContent className="py-6">
                <p className="text-sm text-muted-foreground">Total de Despesas (2023-2024)</p>
                <p className="text-3xl font-bold text-foreground">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)}</p>
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
              <ExpensesPieChart data={expensesByCategory} />
              <ExpensesBarChart data={expensesByMonth} title="Despesas Mensais (2024)" />
            </div>
          </TabsContent>

          <TabsContent value="contato">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Gabinete</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><Building2 className="mr-2 inline h-4 w-4" />{deputy.gabinete.predio}, Sala {deputy.gabinete.sala}, {deputy.gabinete.andar} andar</p>
                  <p><Phone className="mr-2 inline h-4 w-4" />{deputy.gabinete.telefone}</p>
                  <p><Mail className="mr-2 inline h-4 w-4" />{deputy.email}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Redes Sociais</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {deputy.redesSociais.twitter && <Button variant="outline" size="sm" asChild><a href={deputy.redesSociais.twitter} target="_blank"><Twitter className="mr-2 h-4 w-4" />Twitter</a></Button>}
                  {deputy.redesSociais.instagram && <Button variant="outline" size="sm" asChild><a href={deputy.redesSociais.instagram} target="_blank"><Instagram className="mr-2 h-4 w-4" />Instagram</a></Button>}
                  {deputy.redesSociais.facebook && <Button variant="outline" size="sm" asChild><a href={deputy.redesSociais.facebook} target="_blank"><Facebook className="mr-2 h-4 w-4" />Facebook</a></Button>}
                  {deputy.redesSociais.youtube && <Button variant="outline" size="sm" asChild><a href={deputy.redesSociais.youtube} target="_blank"><Youtube className="mr-2 h-4 w-4" />YouTube</a></Button>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
