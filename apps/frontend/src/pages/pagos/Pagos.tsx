"use client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Book, Calendar, ArrowRight } from "lucide-react";

const Pagos = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const cards = [
    {
      id: "matricula",
      route: "/pagos/matricula",
      title: "Matrícula",
      description: "Gestión de procesos de inscripción y pagos iniciales",
      icon: (isHovered: boolean) => (
        <Book
          className={`h-16 w-16 transition-all duration-300 ${
            isHovered ? "text-white" : "text-[#50853C]"
          }`}
        />
      ),
      color: "#50853C",
      hoverBg: "#62A14A", // Color más fuerte
      bgHover: "[#e0ebd9]",
      bgActive: "[#d4e5cb]",
    },
    {
      id: "mensualidad",
      route: "/pagos/mensualidad",
      title: "Mensualidades",
      description: "Control de pagos periódicos y seguimiento de saldos",
      icon: (isHovered: boolean) => (
        <Calendar
          className={`h-16 w-16 transition-all duration-300 ${
            isHovered ? "text-white" : "text-[#F38223]"
          }`}
        />
      ),
      color: "#F38223",
      hoverBg: "#F46A00", // Color más fuerte
      bgHover: "[#fde8d3]",
      bgActive: "[#fcdec0]",
    },
    {
      id: "nivelado",
      route: "/pagos/nivelados",
      title: "Plan Nivelado",
      description:
        "Sistema de cuotas distribuidas y administración de planes especiales",
      icon: (isHovered: boolean) => (
        <svg
          className={`h-16 w-16 transition-all duration-300`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isHovered ? "white" : "#1B1263"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
        </svg>
      ),
      color: "#1B1263",
      hoverBg: "#2D2377", // Color más fuerte
      bgHover: "[#dbd9ea]",
      bgActive: "[#cecce4]",
    },
  ];

  return (
    <div className="flex flex-col w-full py-6">
      {/* Título de la sección */}
      <div className="px-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
        <p className="text-gray-600">
          Administre los diferentes tipos de pagos del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-8">
        {cards.map((card) => {
          const isHovered = hoveredCard === card.id;
          return (
            <div
              key={card.id}
              onClick={() => handleNavigation(card.route)}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative rounded-xl shadow-md border border-gray-100 
                         cursor-pointer transition-all duration-300 overflow-hidden
                         hover:shadow-xl hover:-translate-y-1 flex flex-col bg-white`}
              style={{ minHeight: "380px" }}
            >
              {/* Decoración de fondo */}
              <div
                className={`absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 rounded-full transition-colors duration-300`}
                style={{
                  backgroundColor: isHovered
                    ? "rgba(255, 255, 255, 0.15)"
                    : `${card.color}10`,
                }}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 rounded-full transition-colors duration-300`}
                style={{
                  backgroundColor: isHovered
                    ? "rgba(255, 255, 255, 0.15)"
                    : `${card.color}10`,
                }}
              ></div>
              <div
                className={`absolute ${
                  card.id === "mensualidad"
                    ? "top-1/2 left-0 -translate-x-8"
                    : "top-1/2 right-0 translate-x-8"
                } w-16 h-16 transform -translate-y-8 rounded-full transition-colors duration-300`}
                style={{
                  backgroundColor: isHovered
                    ? "rgba(255, 255, 255, 0.15)"
                    : `${card.color}10`,
                }}
              ></div>

              <div className="p-5 flex flex-col h-full relative z-10">
                {/* Contenedor centrado para el icono */}
                <div
                  className="flex justify-center items-center mb-4"
                  style={{ height: "120px" }}
                >
                  <div
                    className={`w-28 h-28 rounded-xl flex items-center justify-center transform transition-all duration-300 
                      ${
                        isHovered ? "rotate-6 scale-105" : "bg-white shadow-lg"
                      }`}
                    style={{
                      backgroundColor: isHovered ? card.hoverBg : "white",
                    }}
                  >
                    {card.icon(isHovered)}
                  </div>
                </div>

                <h3
                  className={`text-xl font-bold mb-2 text-center transition-colors duration-300 ${
                    isHovered ? "text-white" : "text-gray-800"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`mb-3 text-center text-sm transition-colors duration-300 ${
                    isHovered ? "text-white" : "text-gray-600"
                  }`}
                >
                  {card.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div
                    className={`flex items-center justify-center transition-all duration-300 ${
                      isHovered ? "translate-x-2" : ""
                    }`}
                  >
                    <span
                      className={`font-medium mr-2 transition-colors duration-300 ${
                        isHovered ? "text-white" : ""
                      }`}
                      style={{ color: isHovered ? "white" : card.color }}
                    >
                      Acceder
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 transition-all duration-300 ${
                        isHovered ? "translate-x-2 text-white" : ""
                      }`}
                      style={{ color: isHovered ? "white" : card.color }}
                    />
                  </div>
                </div>
              </div>

              {/* Overlay de color para el efecto de hover */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isHovered ? "opacity-85" : "opacity-0"
                }`}
                style={{ backgroundColor: card.hoverBg, zIndex: 5 }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pagos;
