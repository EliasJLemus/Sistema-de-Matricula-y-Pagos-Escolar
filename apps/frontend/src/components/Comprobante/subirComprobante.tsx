import { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud, FileImage } from "lucide-react";

export default function SubirComprobante() {
  const [codigo, setCodigo] = useState("");
  const [nombrePadre, setNombrePadre] = useState("");
  const [encargado, setEncargado] = useState("");
  const [grado, setGrado] = useState("");
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [uuidComprobante, setUuidComprobante] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const uuid = query.get("comprobante");

    if (uuid) {
      setUuidComprobante(uuid);

      axios
        .get(`http://localhost:3000/comprobante/comprobante-matricula/${uuid}`)
        .then((res) => {
          const data = res.data.data;
          setCodigo(data.codigo_estudiante);
          setNombrePadre(data.nombre_estudiante);
          setEncargado(data.nombre_encargado);
          setGrado(`${data.nombre_grado} ${data.seccion}`);
        })
        .catch((err) => {
          console.error("❌ Error al obtener datos del estudiante:", err);
          setMensaje("No se pudo cargar la información del estudiante.");
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comprobante || !uuidComprobante) {
      setMensaje("⚠️ Faltan datos requeridos.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombrePadre);
    formData.append("codigo", codigo);
    formData.append("grado", grado);
    formData.append("encargado", encargado);
    formData.append("comprobante", comprobante);
    formData.append("uuid_comprobante", uuidComprobante);

    try {
      await axios.post(
        `http://localhost:3000/comprobante/subir-comprobante-matricula/${uuidComprobante}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      setMensaje("✅ Comprobante enviado con éxito.");
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al enviar el comprobante.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 to-blue-100 px-4 font-[Poppins]">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-8 border-t-8 border-green-600">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo-escuela.png" alt="Sunny Path" className="h-14 mb-2" />
          <h1 className="text-2xl font-bold text-green-700">Sunny Path Bilingual School</h1>
          <p className="text-sm text-gray-500">Formulario para Adjuntar Comprobante de Pago</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Código del Estudiante" value={codigo} />
            <Campo label="Estudiante" value={nombrePadre} />
            <Campo label="Encargado" value={encargado} />
            <Campo label="Grado" value={grado} />
          </div>

          {/* Upload comprobante */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileImage className="inline-block w-4 h-4 mr-1" />
              Comprobante (Imagen)
            </label>
            <input
              type="file"
              accept="image/*"
              required
              className="w-full px-4 py-2 border rounded-md bg-white file:cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  setComprobante(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
              <img
                src={previewUrl}
                alt="Vista previa"
                className="mx-auto max-h-64 rounded-lg border shadow-md"
              />
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition"
          >
            <UploadCloud className="w-5 h-5" /> Enviar Comprobante
          </button>

          {/* Mensaje */}
          {mensaje && (
            <p
              className={`text-center text-sm mt-2 font-semibold ${
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

// Componente Campo
function Campo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-700"
      />
    </div>
  );
}
