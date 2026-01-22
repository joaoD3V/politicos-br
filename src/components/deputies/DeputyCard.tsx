import { Link } from "react-router-dom";
import { MapPin, Building2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Deputy } from "@/data/mockDeputies";
import { cn } from "@/lib/utils";

interface DeputyCardProps {
  deputy: Deputy;
}

export function DeputyCard({ deputy }: DeputyCardProps) {
  const situacaoStyles = {
    "Exercício": "bg-status-approved text-status-approved-foreground",
    "Afastado": "bg-status-pending text-status-pending-foreground",
    "Licenciado": "bg-status-archived text-status-archived-foreground",
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Photo placeholder */}
          <div className="flex h-32 w-full items-center justify-center bg-muted sm:h-auto sm:w-32 sm:min-h-[160px]">
            <User className="h-16 w-16 text-muted-foreground/40" />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-semibold">
                  {deputy.partido}
                </Badge>
                <Badge className={cn("text-xs", situacaoStyles[deputy.situacao])}>
                  {deputy.situacao}
                </Badge>
              </div>

              <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {deputy.nome}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {deputy.uf}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  Deputado Federal
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link to={`/deputado/${deputy.id}`}>Ver Perfil</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
