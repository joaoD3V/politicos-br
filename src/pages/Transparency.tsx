import { Database, RefreshCw, Scale, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Transparency() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Transparência de Dados</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Entenda de onde vêm os dados e como mantemos nosso compromisso com a transparência.
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" />Fonte dos Dados</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>Todas as informações apresentadas nesta plataforma são obtidas diretamente da <strong>API de Dados Abertos da Câmara dos Deputados</strong>.</p>
                <a href="https://dadosabertos.camara.leg.br/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  Acessar API oficial <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5 text-primary" />Atualização dos Dados</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Os dados são atualizados regularmente seguindo a disponibilização oficial da Câmara dos Deputados. Informações de despesas podem ter um atraso de até 60 dias devido ao processo de prestação de contas.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-primary" />Compromisso com a Neutralidade</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">
                <p>O PoliticosBR é uma plataforma apartidária. Apresentamos os dados de forma objetiva, sem fazer juízos de valor ou análises políticas. Nosso objetivo é informar, não influenciar.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
