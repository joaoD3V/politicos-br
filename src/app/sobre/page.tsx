import { Target, Code, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Sobre o Projeto</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            PoliticosBR é uma iniciativa de tecnologia cívica para promover a transparência política no Brasil.
          </p>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Nossa Missão</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Tornar as informações sobre a atuação parlamentar acessíveis a todos os cidadãos brasileiros, promovendo uma democracia mais participativa e informada.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Code className="h-5 w-5 text-primary" />Open Source</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Acreditamos na transparência em todos os níveis. Por isso, nosso código é aberto e qualquer pessoa pode contribuir, auditar ou utilizar como base para outros projetos cívicos.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Civic Tech</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Fazemos parte do movimento global de civic tech, utilizando tecnologia para fortalecer a relação entre cidadãos e governo, promovendo participação cívica ativa.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}