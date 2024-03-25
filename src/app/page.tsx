"use client";
import { Session } from "inspector";
// pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

type userInfo = {
  "id": string;
  "createdAt": string;
  "updatedAt": string;
  "AssistantID": string;
  "Personal Access Token": string;
  "BaseClientesID": string;
  "ConversacionesIniciadas": number;
  Email: string;
}

type userInfoServicio = userInfo & {
  "WorkspaceID": string;
  "BaseAgendaID": string;
  "BaseServiciosID": string;
  "BaseEmpleadosID": string;
}

type userInfoConsumo = userInfoServicio & {
  "RefreshToken": string;
  "BasePedidosID": string;
  "BaseProductosID": string;
}

type UserSession = Session & {
  accessToken: string;
  refreshToken: string;
  userInfo: userInfoServicio | userInfoConsumo;
  assistantType: string;
};


export default function Home() {
  const datos = useSession();
  const { data: session } = datos;
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
