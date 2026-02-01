'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, Database, Users, Eye, ArrowRight, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SearchBar } from "@/components/deputies/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { searchDeputies } from "@/services/camara-api";

const benefits = [
  { icon: Shield, title: "Transparência", description: "Acesso direto a informações públicas de deputados federais" },
  { icon: Database, title: "Dados Oficiais", description: "Informações provenientes da API da Câmara dos Deputados" },
  { icon: Users, title: "Acesso Gratuito", description: "Plataforma 100% gratuita para todos os cidadãos" },
  { icon: Eye, title: "Consciência Cívica", description: "Acompanhe a atuação dos seus representantes" },
];

const steps = [
  { number: "1", title: "Busque", description: "Digite o nome do deputado ou partido" },
  { number: "2", title: "Explore", description: "Veja propostas, votações e despesas" },
  { number: "3", title: "Acompanhe", description: "Fique informado sobre a atuação parlamentar" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const params: any = { query: searchQuery };
      await searchDeputies(params);
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Erro na busca:', error);
      // Mesmo com erro, redireciona para mostrar mensagem de erro
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Transparência, Dados Públicos e{" "}
              <span className="text-primary">Consciência Política</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Acompanhe a atuação dos deputados federais brasileiros com dados oficiais
              do governo. Propostas, votações, despesas e muito mais.
            </p>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="Buscar deputado por nome ou partido..."
              size="lg"
              className="mx-auto max-w-xl"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              <CheckCircle className="mr-1 inline h-4 w-4 text-status-approved" />
              Dados oficiais da Câmara dos Deputados
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
            Como Funciona
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground md:text-3xl">
            Por que usar o PoliticosBR?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
            Pronto para explorar?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Comece agora mesmo a acompanhar a atuação dos deputados federais
          </p>
          <Button size="lg" asChild>
            <Link href="/buscar">
              Começar a Explorar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}