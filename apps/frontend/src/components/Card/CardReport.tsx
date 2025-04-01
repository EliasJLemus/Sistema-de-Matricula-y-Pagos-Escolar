import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";

interface Stat {
  label: string;
  value: string | number;
}

interface ReportCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  stats?: Stat[];
  onClick?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  icon,
  stats,
  onClick,
}) => {
  return (
    <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex items-start justify-between pb-4 border-b">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 py-4">
        <p className="text-sm text-muted-foreground leading-normal">{description}</p>

        {stats && (
          <div className="grid grid-cols-2 gap-y-2 pt-2">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <span className="text-base font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <div className="p-4 pt-0">
        <Button onClick={onClick} className="w-full text-sm font-semibold">
          Ver Reporte
        </Button>
      </div>
    </Card>
  );
};
