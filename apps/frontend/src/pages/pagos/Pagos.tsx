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

  return (
    <div className="flex flex-col w-full h-full py-6">
      {/* Título de la sección */}
      <div className="px-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
        <p className="text-gray-600">
          Seleccione una categoría para gestionar los pagos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 flex-1">
        {/* Matrícula Card */}
        <div
          onClick={() => handleNavigation("/pagos/matricula")}
          onMouseEnter={() => setHoveredCard("matricula")}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative bg-white rounded-xl shadow-md border border-gray-100 
                     cursor-pointer transition-all duration-300 overflow-hidden group
                     hover:shadow-xl hover:-translate-y-1 flex flex-col"
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 bg-[#50853C]/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-[#50853C]/10 rounded-full"></div>
          <div className="absolute top-1/2 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 bg-[#50853C]/10 rounded-full"></div>

          <div className="p-6 flex flex-col h-full relative z-10">
            {/* Contenedor centrado para el icono agrandado */}
            <div
              className="flex justify-center items-center mb-6"
              style={{ height: "160px" }}
            >
              <div
                className={`w-36 h-36 rounded-xl flex items-center justify-center bg-white shadow-lg transform transition-all duration-300 ${
                  hoveredCard === "matricula" ? "rotate-6 scale-105" : ""
                }`}
              >
                <Book
                  className={`h-20 w-20 text-[#50853C] transition-all duration-300 ${
                    hoveredCard === "matricula" ? "rotate-12" : ""
                  }`}
                />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Matrícula
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Gestionar procesos de matrícula
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div
                className={`flex items-center justify-center transition-all duration-300 ${
                  hoveredCard === "matricula" ? "translate-x-2" : ""
                }`}
              >
                <span className="text-[#50853C] font-medium mr-2">Acceder</span>
                <ArrowRight
                  className={`h-5 w-5 text-[#50853C] transition-all duration-300 ${
                    hoveredCard === "matricula" ? "translate-x-2" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mensualidades Card */}
        <div
          onClick={() => handleNavigation("/pagos/mensualidad")}
          onMouseEnter={() => setHoveredCard("mensualidad")}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative bg-white rounded-xl shadow-md border border-gray-100 
                     cursor-pointer transition-all duration-300 overflow-hidden group
                     hover:shadow-xl hover:-translate-y-1 flex flex-col"
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 bg-[#d56a10]/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-[#d56a10]/10 rounded-full"></div>
          <div className="absolute top-1/2 left-0 w-16 h-16 transform -translate-x-8 -translate-y-8 bg-[#d56a10]/10 rounded-full"></div>

          <div className="p-6 flex flex-col h-full relative z-10">
            {/* Contenedor centrado para el icono agrandado */}
            <div
              className="flex justify-center items-center mb-6"
              style={{ height: "160px" }}
            >
              <div
                className={`w-36 h-36 rounded-xl flex items-center justify-center bg-white shadow-lg transform transition-all duration-300 ${
                  hoveredCard === "mensualidad" ? "rotate-6 scale-105" : ""
                }`}
              >
                <Calendar
                  className={`h-20 w-20 text-[#d56a10] transition-all duration-300 ${
                    hoveredCard === "mensualidad" ? "rotate-12" : ""
                  }`}
                />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Mensualidades
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Administrar pagos mensuales
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div
                className={`flex items-center justify-center transition-all duration-300 ${
                  hoveredCard === "mensualidad" ? "translate-x-2" : ""
                }`}
              >
                <span className="text-[#d56a10] font-medium mr-2">Acceder</span>
                <ArrowRight
                  className={`h-5 w-5 text-[#d56a10] transition-all duration-300 ${
                    hoveredCard === "mensualidad" ? "translate-x-2" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Nivelado Card - ICONO ASTERISCO */}
        <div
          onClick={() => handleNavigation("/pagos/nivelados")}
          onMouseEnter={() => setHoveredCard("nivelado")}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative bg-white rounded-xl shadow-md border border-gray-100 
                     cursor-pointer transition-all duration-300 overflow-hidden group
                     hover:shadow-xl hover:-translate-y-1 flex flex-col"
        >
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 bg-[#1B1263]/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-[#1B1263]/10 rounded-full"></div>
          <div className="absolute bottom-1/2 right-0 w-16 h-16 transform translate-x-8 translate-y-8 bg-[#1B1263]/10 rounded-full"></div>

          <div className="p-6 flex flex-col h-full relative z-10">
            {/* Contenedor centrado para el icono agrandado */}
            <div
              className="flex justify-center items-center mb-6"
              style={{ height: "160px" }}
            >
              <div
                className={`w-36 h-36 rounded-xl flex items-center justify-center bg-white shadow-lg transform transition-all duration-300 ${
                  hoveredCard === "nivelado" ? "rotate-6 scale-105" : ""
                }`}
              >
                {/* Icono asterisco como el del encabezado */}
                <svg
                  className={`h-20 w-20 transition-all duration-300 ${
                    hoveredCard === "nivelado" ? "rotate-12" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1B1263"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M2 12h20M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Plan Nivelado
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Gestionar Plan nivelado
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div
                className={`flex items-center justify-center transition-all duration-300 ${
                  hoveredCard === "nivelado" ? "translate-x-2" : ""
                }`}
              >
                <span className="text-[#1B1263] font-medium mr-2">Acceder</span>
                <ArrowRight
                  className={`h-5 w-5 text-[#1B1263] transition-all duration-300 ${
                    hoveredCard === "nivelado" ? "translate-x-2" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
