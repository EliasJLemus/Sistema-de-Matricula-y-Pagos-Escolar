import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.username,  
          password: data.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error en la autenticación");
      }
      
      localStorage.setItem("token", result.token);
      onLogin();

    } catch (error) {
      console.error("Login fallido:", error);
      alert("Error en la autenticación. Verifica tus credenciales.");
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
   
      <div className="w-1/2 relative bg-[#1B1263]">
      
        <div 
          className="absolute right-0 top-0 w-64 h-64 bg-[#50853C] clip-path-triangle"
        />
        
       
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#FFFDF1] w-96 h-96 rounded-2xl shadow-2xl transform rotate-3" />
        </div>

     
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <img 
            src="/suny.png" 
            alt="Logo" 
            className="w-72 mb-8 drop-shadow-lg" 
          />
        </div>
      </div>

   
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl w-[480px] relative">
         
          <div 
            className="absolute -top-8 -right-8 w-32 h-32 bg-[#50853C] clip-path-triangle opacity-80"
          />

       
          <h1 className="text-4xl font-bold text-[#1B1263] mb-2">Mi Cuenta</h1>
          <p className="text-lg text-gray-600 mb-8">Ingresa tus credenciales</p>

          <form onSubmit={handleSubmit(onSubmit)}> 
            <div className="mb-6">
              <label className="block text-[#1B1263] font-semibold mb-3">
                Usuario
              </label>
              <input
                type="text"
                {...register("username", { 
                  required: "El usuario es requerido" 
                })}
                className="w-full p-4 border-2 border-[#50853C]/20 rounded-xl focus:border-[#50853C]"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-[#1B1263] font-semibold mb-3">
                Contraseña
              </label>
              <input
                type="password"
                {...register("password", { 
                  required: "La contraseña es requerida" 
                })}
                className="w-full p-4 border-2 border-[#50853C]/20 rounded-xl focus:border-[#50853C]"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="mb-8 text-right">
              <a 
                href="#" 
                className="text-[#50853C] hover:text-[#1B1263] font-medium"
              >
                Bienvenido a Sunny Path
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#50853C] hover:bg-[#1B1263] py-6 text-lg rounded-xl"
            >
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
