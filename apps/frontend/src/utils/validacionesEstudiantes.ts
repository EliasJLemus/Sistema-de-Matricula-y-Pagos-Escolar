
export const validateInput = (name: string, value: string): boolean => {
    if (
      ["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"].includes(name)
    ) {
      if (value.startsWith(" ")) return false;
      return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ\s]*$/.test(value);
    }
  
    if (name === "nacionalidad") {
      return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ]*$/.test(value);
    }
  
    if (name === "identidad") {
      return /^\d*$/.test(value); // Solo números
    }
  
    if (name === "descripcion_alergica") {
      if (value === "") return true;
      if (value.startsWith(" ")) return false;
      return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜäëïöüÄËÏÖÜ\s.,;:¿?¡!()]+$/.test(value);
    }
  
    if (name === "direccion") {
      return !value.startsWith(" ");
    }
  
    return true;
  };
  
  export const getErrorMessage = (name: string, value: string): string => {
    if (
      ["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"].includes(name)
    ) {
      return value.startsWith(" ")
        ? "No se permiten espacios al inicio"
        : "Solo se permiten letras, acentos y diéresis";
    }
  
    if (name === "nacionalidad") {
      return "Solo se permiten letras, acentos y diéresis, sin espacios";
    }
  
    if (name === "identidad") {
      return "Solo se permiten números y debe tener entre 5 y 30 caracteres";
    }
  
    if (name === "descripcion_alergica") {
      return value.startsWith(" ")
        ? "No se permiten espacios al inicio"
        : "Caracteres no permitidos";
    }
  
    if (name === "direccion") {
      return "No se permiten espacios al inicio";
    }
  
    return "Valor inválido";
  };
  