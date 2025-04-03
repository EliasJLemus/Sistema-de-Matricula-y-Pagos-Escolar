import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar hook de navegación

const Home = () => {
  const navigate = useNavigate(); // 2. Inicializar hook  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/suny.png",
    "/sunnyschool.jpg",
    "/sunnystudents.jpg",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  // Función para navegación
  const handleNavigation = (route) => {
    navigate(route);
  };

  // Datos de ejemplo

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Contenido Principal (MANTENIDO INTACTO) */}
      <main className="flex-grow p-8">
        {/* Tarjetas de Resumen CON NAVEGACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tarjeta Estudiantes */}
          <div 
            onClick={() => handleNavigation('/estudiantes')}
            className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#50853C] cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-xl text-gray-600">Estudiantes</div>
          </div>
          
          {/* Tarjeta Pagos Pendientes */}
          <div 
            onClick={() => handleNavigation('/pagos')}
            className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#d56a10] cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">💳</div>
            <div className="text-xl text-gray-600">Pagos</div>
          </div>
          
          {/* Tarjeta Apoderados */}
          <div 
            onClick={() => handleNavigation('/apoderados')}
            className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#1B1263] cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">👨👩👧👦</div>
            <div className="text-xl text-gray-600">Apoderados</div>
          </div>
          
          {/* Tarjeta Reportes */}
          <div 
            onClick={() => handleNavigation('/reportes')}
            className="bg-white p-6 rounded-xl shadow-md border-t-4 border-yellow-500 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">📊</div>
            <div className=" text-xl text-gray-600">Reportes Recientes</div>
          </div>
        </div>

         {/* Sección de Carrusel y Acciones */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Imágenes escolares</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={images[currentImageIndex]}
                alt="Galería escolar"
                className="w-full h-full object-contain bg-white p-4"
              />
              
              {/* Flechas de navegación mejoradas */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white shadow-lg transform hover:scale-110 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full hover:bg-white shadow-lg transform hover:scale-110 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicadores de posición mejorados */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-[#1B1263]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">🚀 Acciones Rápidas</h2>
            <div className="space-y-4">
              <button 
                onClick={() => handleNavigation('/estudiantes/nuevo')}
                className="w-full bg-[#1B1263] text-white p-3 rounded-lg hover:bg-blue-900 transition">
                + Nuevo Estudiante
              </button>
              
              <button 
                onClick={() => handleNavigation('/registrar-pago')}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                + Nuevo apoderado
              </button>
              
              <button 
                onClick={() => handleNavigation('/generar-reporte')}
                className="w-full bg-[#F28122] text-white p-3 rounded-lg hover:bg-[#d56a10] transition">
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
