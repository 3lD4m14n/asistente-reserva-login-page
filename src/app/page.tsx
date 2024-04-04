"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { airtableOauthClient } from "@/helpers/airtableAuthClient";
import { UserSession, InputData } from "@/types";

export default function Home() {
  const datos = useSession();
  const session = datos.data as UserSession | null;

  useEffect(() => {
    console.log(datos);
  }, [datos]);

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-300 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {session && session.user && session.user.image ? (
          <div className="flex flex-col">
            <div className="flex items-center">
              <img
                src={session.user.image}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <p className="text-lg font-semibold text-gray-700">
                {session.user.name}
              </p>
            </div>
            {session.assistantType === "consumo" && <Consumo />}
            {session.assistantType === "servicio" && <Servicio />}
            <button
              className={"bg-red-500 rounded-md"}
              onClick={() => signOut()}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
          >
            Iniciar sesión con Google
          </button>
        )}
      </div>
    </div>
  );
}

function FormData({}) {
  const { handleSubmit, register } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = (data) => {
    console.log(data);
  };

  return (
    <>
      <button
        onClick={async () => {
          await airtableOauthClient.requestAuthorizationCode();
        }}
      >
        Habilitar Airtable
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Rubro:
          <input type="text" {...register("rubro")} />
        </label>
        <label>
          Nombre de la tienda:
          <input type="text" {...register("nombreTienda")} />
        </label>
        <label>
          Horario:
          <input type="text" {...register("horario")} />
        </label>
        <label>
          Comportamiento del asistente:
          <input type="text" {...register("comportamientoAsistente")} />
        </label>
        <input type="submit" />
      </form>
    </>
  );
}

function Consumo({}) {
  return (
    <div className="text-black">
      <p>Consumo</p>
      <FormData />
    </div>
  );
}

function Servicio({}) {
  return (
    <div className="text-black">
      <p>Servicio</p>
      <button>Habilitar Airtable</button>
    </div>
  );
}
