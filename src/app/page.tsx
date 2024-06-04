"use client";
import { UserSession } from "@/types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Consumo, Servicio } from "@/components/Forms";
import Image from "next/image";

export default function Home() {
  const datos = useSession();
  const session = datos.data as UserSession | null;

  useEffect(() => {
    console.log("datos", datos);
  }, [datos]);

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-300 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {session && session.user && session.user.image ? (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Image
                src={session.user.image}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
              <p className="text-lg font-semibold text-gray-700">
                {session.user.name}
              </p>
            </div>
            {session.assistantType === "Consumo" &&
              "BasePedidosID" in session.userInfo && (
                <Consumo userData={session.userInfo} />
              )}
            {session.assistantType === "Servicio" &&
              "BaseAgendaID" in session.userInfo && (
                <Servicio userData={session.userInfo} />
              )}
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
