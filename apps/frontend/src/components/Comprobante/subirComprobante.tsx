import { useState, useEffect } from "react";
import axios from "axios";

export default function SubirComprobante() {
  const [codigo, setCodigo] = useState("STU-20250405-001");
  const [nombrePadre, setNombrePadre] = useState("");
  const [encargado, setEncargado] = useState("María Gómez");
  const [grado, setGrado] = useState("3ro Primaria");
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const padre = query.get("padre");
    if (padre) setNombrePadre(padre);
    // Aquí podrías extraer también más datos por query o fetch desde el backend.
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comprobante) {
      setMensaje("⚠️ Por favor suba una imagen del comprobante.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombrePadre);
    formData.append("codigo", codigo);
    formData.append("grado", grado);
    formData.append("encargado", encargado);
    formData.append("comprobante", comprobante);

    try {
      await axios.post("http://localhost:3000/api/subir-comprobante", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensaje("✅ Comprobante enviado con éxito.");
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al enviar el comprobante.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4 font-[Poppins]">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-lg p-8 border-t-8 border-green-600">
        {/* Logo + título */}
        <div className="flex items-center justify-center mb-6">
          <img
            src="/logo-escuela.png"
            alt="Sunny Path"
            className="h-12 mr-3"
          />
          <h1 className="text-2xl font-bold text-green-700">
            Sunny Path Bilingual School
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-1 text-center">
          Adjuntar Comprobante de Pago
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Complete la siguiente información. Luego suba la foto del comprobante.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campos readOnly */}
          <div className="grid grid-cols-1 gap-4">
            <Campo label="Código del Estudiante" value={codigo} />
            <Campo label="Nombre del Estudiante" value={nombrePadre} />
            <Campo label="Encargado" value={encargado} />
            <Campo label="Grado" value={grado} />
          </div>

          {/* Upload de comprobante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprobante (Imagen)
            </label>
            <input
              type="file"
              accept="image/*"
              required
              className="w-full px-4 py-2 border rounded-md bg-white"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setComprobante(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          {/* Vista previa */}
          {previewUrl && (
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
              <img
                src={previewUrl}
                alt="Vista previa del comprobante"
                className="mx-auto max-h-60 rounded border shadow"
              />
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition"
          >
            Enviar Comprobante
          </button>

          {mensaje && (
            <p
              className={`text-center text-sm mt-2 font-medium ${
                mensaje.includes("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// Componente reutilizable para campos readOnly
function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
      />
    </div>
  );
}
