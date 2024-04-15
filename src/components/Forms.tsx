import { createAirtableOauthClient } from "@/helpers/airtableAuthClient";
import {
  AssistantType,
  InputData,
  userInfoConsumo,
  userInfoServicio,
} from "@/types";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-black block bg-gray-300 p-2 rounded-lg">
      {children}
    </label>
  );
}

function FormData({
  userData,
  table,
  assistantType,
}: {
  userData: userInfoServicio | userInfoConsumo;
  table: string;
  assistantType: AssistantType;
}) {
  const inputData = userData["Personalizacion del Asistente"];
  const { handleSubmit, register } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = (data) => {
    let newRow = JSON.parse(JSON.stringify(userData));
    newRow["Personalizacion del Asistente"] = data;
    console.log(
      "newRow:\n",
      newRow,
      "\noldRow:\n",
      userData,
      "\ndata:\n",
      data,
    );

    axios.put(`/api/botpressRowUpdate`, {
      table,
      newRow,
      assistantType: assistantType,
      oldRow: userData,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-gray-200 p-4 rounded-lg gap-2"
    >
      <button
        onClick={async () => {
          const airtableOauthClient = createAirtableOauthClient();
          await airtableOauthClient.requestAuthorizationCode();
        }}
      >
        Habilitar Airtable
      </button>
      <Label>
        Rubro:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("rubro")}
          value={inputData.rubro}
        />
      </Label>
      <Label>
        Nombre de la tienda:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("nombreTienda")}
          value={inputData.nombreTienda}
        />
      </Label>
      <Label>
        Horario:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("horario")}
          value={inputData.horario}
        />
      </Label>
      <Label>
        Comportamiento del asistente:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("comportamientoAsistente")}
          value={inputData.comportamientoAsistente}
        />
      </Label>
      <div className="flex justify-center">
        <input
          type="submit"
          value="Actualizar"
          className="bg-blue-500 rounded-lg w-1/2 cursor-pointer"
        />
      </div>
    </form>
  );
}

export function Consumo({ userData }: { userData: userInfoConsumo }) {
  return (
    <div className="text-black">
      <p>Consumo</p>
      <FormData
        userData={userData}
        table="UsersConsumoTable"
        assistantType="Consumo"
      />
    </div>
  );
}

export function Servicio({ userData }: { userData: userInfoServicio }) {
  return (
    <div className="text-black">
      <p>Servicio</p>
      <button
        onClick={async () => {
          const airtableOauthClient = createAirtableOauthClient();
          await airtableOauthClient.requestAuthorizationCode();
        }}
      >
        Habilitar Airtable
      </button>
    </div>
  );
}
