'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Building2, Mail, Phone, Calendar, GraduationCap, Users, FileText, DollarSign, Vote, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { CamaraAPI } from "@/services/camara-api";
import type { Deputy } from "@/data/mockDeputies";
import { ExpenseChart } from "@/components/charts/ExpenseChart";

export default function DeputyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deputy, setDeputy] = useState<Deputy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeputy = async () => {
      if (!params.id) return;

      try {
        const deputyData = await CamaraAPI.getDeputyById(params.id as string);
        if (deputyData) {
          setDeputy(deputyData);
        } else {
          setError("Deputado não encontrado");
        }
      } catch (err) {
        console.error("Erro ao buscar deputado:", err);
        setError("Erro ao carregar dados do deputado");
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
            <div className="md:col-span-1 flex items-center">
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
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {deputy.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{deputy.email}</span>
                      </div>
                    )}
                    {deputy.telefone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{deputy.telefone}</span>
                      </div>
                    )}
                    {deputy.gabinete?.sala && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Gabinete: {deputy.gabinete.sala}
                          {deputy.gabinete.predio && ` - ${deputy.gabinete.predio}`}
                          {deputy.gabinete.andar && ` (${deputy.gabinete.andar}º andar)`}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
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
                        Legislatura: {deputy.legislatura}ª
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{deputy.proposicoes.length}</div>
                      <div className="text-sm text-muted-foreground">Proposições</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">
                        {deputy.despesas.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Despesas</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Vote className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{deputy.votacoes.total}</div>
                      <div className="text-sm text-muted-foreground">Votações</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Expenses Chart */}
              {deputy.despesas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Despesas Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ExpenseChart expenses={deputy.despesas.slice(0, 10)} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
