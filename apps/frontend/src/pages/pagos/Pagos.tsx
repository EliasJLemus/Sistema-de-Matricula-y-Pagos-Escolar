import React from "react";
import { To, useNavigate } from "react-router-dom";

const Pagos = () => {
  const navigate = useNavigate();

  const handleNavigation = (route: To) => {
    navigate(route);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-grow p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta Matrícula */}
          <div 
            onClick={() => handleNavigation('/pagos/matricula')}
            className="bg-white p-8 rounded-xl shadow-md border-t-8 border-[#50853C] 
                     cursor-pointer hover:shadow-lg transition-all h-64 flex flex-col 
                     justify-center items-center hover:bg-gray-50">
            <div className="text-5xl mb-4">📘</div>
            <div className="text-2xl font-semibold text-gray-700">Matrícula</div>
            <p className="text-gray-500 mt-2">Gestionar procesos de matrícula</p>
          </div>
          
          {/* Tarjeta Mensualidades */}
          <div 
            onClick={() => handleNavigation('/pagos/mensualidad')}
            className="bg-white p-8 rounded-xl shadow-md border-t-8 border-[#d56a10] 
                     cursor-pointer hover:shadow-lg transition-all h-64 flex flex-col 
                     justify-center items-center hover:bg-gray-50">
            <div className="text-5xl mb-4">💰</div>
            <div className="text-2xl font-semibold text-gray-700">Mensualidades</div>
            <p className="text-gray-500 mt-2">Administrar pagos mensuales</p>
          </div>
 {/* Tarjeta Matrícula */}
 <div 
            onClick={() => handleNavigation('/pagos/nivelados')}
            className="bg-white p-8 rounded-xl shadow-md border-t-8 border-[#1B1263] 
                     cursor-pointer hover:shadow-lg transition-all h-64 flex flex-col 
                     justify-center items-center hover:bg-gray-50">
            <div className="text-5xl mb-4">🏧</div>
            <div className="text-2xl font-semibold text-gray-700">Plan Nivelado</div>
            <p className="text-gray-500 mt-2">Gestionar Plan nivelado</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Pagos;