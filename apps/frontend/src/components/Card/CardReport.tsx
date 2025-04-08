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
    <Card 
      className="flex flex-col justify-between transition-all duration-300 ease-in-out transform-gpu hover:-translate-y-1"
      style={{
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFFBE6',
        // Transición suave para el cambio de color
        transition: 'background-color 0.2s ease, transform 0.3s ease, box-shadow 0.3s ease',
      }}
      // Cambio sutil de color al hacer hover
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F0D1'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFBE6'}
    >
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
      <Button 
        onClick={onClick} 
        className="w-full text-sm font-semibold bg-[#538A3E] hover:bg-[#406C2D] text-white rounded-lg px-4 py-2 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:bg-[#345823] active:shadow-inner hover:-translate-y-1 hover:scale-[1.02] transform-gpu"
        style={{
          boxShadow: '0px 4px 15px rgba(83, 138, 62, 0.3)',
          willChange: 'transform'
        }}
      >
        Ver Reporte
      </Button>
      </div>
    </Card>
  );
};