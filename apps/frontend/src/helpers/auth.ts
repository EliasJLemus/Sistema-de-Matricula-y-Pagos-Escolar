export interface UsuarioPayload {
    uuid: string;
    usuario: string;
    rol: string;
    codigo: string;
  }
  
  export const getUsuarioFromToken = (): UsuarioPayload | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
  
      return {
        uuid: decoded.uuid,
        usuario: decoded.usuario,
        rol: decoded.rol,
        codigo: decoded.codigo,
      };
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return null;
    }
  };
  