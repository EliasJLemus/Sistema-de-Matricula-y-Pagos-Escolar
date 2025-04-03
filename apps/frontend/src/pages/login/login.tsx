import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log("Datos ingresados:", data);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-b from-blue-900 via-blue-700 to-[#50853C] flex flex-col justify-center items-center text-white p-6  rounded-r-[45px] relative">
      <div 
        className="absolute inset-0 opacity-35 z-10 rounded-r-[45px]"
        style={{  backgroundImage: "url('/bluebg.png')", backgroundSize: "cover", backgroundRepeat: "repeat" }}
      ></div>
        <div className="text-center">
        <img src="/suny.png" alt="Logo" className="w-96 mx-auto mb-10" />
        
          
          <p className="text-base font-bold mt-4">Responsabilidad • Respeto • Colaboración</p>
        </div>
      </div>

      <div className="w-1/2   flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold mb-4 relative -top-20 text-[#1B1263]">Bienvenido a</h2>
        <h2 className="text-4xl font-bold mb-4 relative -top-20 text-[#1B1263]">Sunny Path Bilingual School</h2>
        <div className="bg-[#FFFDF1] p-8 rounded-lg shadow-lg w-96">
          <h3 className="font-bold text-xl mb-4">Accede a tu cuenta</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Usuario</label>
              <input
                type="text"
                {...register("username", { required: "El usuario es requerido" })}
                className="w-full p-2 border rounded mt-1"
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                {...register("password", { required: "La contraseña es requerida" })}
                className="w-full p-2 border rounded mt-1"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-[#50853C] hover:bg-[#65C73F] text-white py-2 rounded">
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
