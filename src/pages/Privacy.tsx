import { Shield } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>
          </div>

          <Card>
            <CardContent className="prose prose-slate max-w-none py-8 text-muted-foreground">
              <h2 className="text-xl font-semibold text-foreground">Coleta de Dados</h2>
              <p>O PoliticosBR <strong>não coleta dados pessoais</strong> dos usuários. Não utilizamos cookies de rastreamento, não armazenamos informações de navegação e não compartilhamos nenhum dado com terceiros.</p>

              <h2 className="text-xl font-semibold text-foreground mt-6">Dados Públicos</h2>
              <p>Todas as informações exibidas na plataforma são de domínio público, obtidas através da API oficial da Câmara dos Deputados.</p>

              <h2 className="text-xl font-semibold text-foreground mt-6">Contato</h2>
              <p>Dúvidas sobre privacidade podem ser enviadas através dos canais oficiais do projeto.</p>

              <p className="text-sm mt-8">Última atualização: Janeiro de 2026</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
