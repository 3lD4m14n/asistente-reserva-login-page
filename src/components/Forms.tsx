import {
  AssistantType,
  InputData,
  userInfoConsumo,
  userInfoServicio,
} from "@/types";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";

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
  const [inputData, setInputData] = useState(
    userData["Personalizacion del Asistente"],
  );
  const { handleSubmit, register } = useForm<InputData>();

  const onSubmit: SubmitHandler<InputData> = (data) => {
    let newRow = JSON.parse(JSON.stringify(userData));
    newRow["Personalizacion del Asistente"] = data;

    let newDataBase = {
      table,
      newRow,
      assistantType: assistantType,
      oldRow: userData,
    };

    let newData;
    if (assistantType === "Servicio" && "WorkspaceID" in userData) {
      newData = { ...newDataBase, airtableWorkspaceID: userData.WorkspaceID };
    }
    console.log(
      "newRow:\n",
      newRow,
      "\noldRow:\n",
      userData,
      "\ndata:\n",
      newData,
    );

    axios.post(`/api/botpressRowUpdate`, newData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-gray-200 p-4 rounded-lg gap-2"
    >
      <a href="/auth/requestAuthorization">Habilitar Airtable</a>
      <Label>
        Rubro:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("rubro", {
            value: inputData ? inputData.rubro : "",
            onChange: (e) =>
              setInputData({ ...inputData, rubro: e.target.value }),
          })}
        />
      </Label>
      <Label>
        Nombre de la tienda:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("nombreTienda", {
            value: inputData ? inputData.nombreTienda : "",
            onChange: (e) =>
              setInputData({ ...inputData, nombreTienda: e.target.value }),
          })}
        />
      </Label>
      <Label>
        Horario:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("horario", {
            value: inputData ? inputData.horario : "",
            onChange: (e) =>
              setInputData({ ...inputData, horario: e.target.value }),
          })}
        />
      </Label>
      <Label>
        Comportamiento del asistente:
        <input
          className="text-black bg-gray-100 w-full rounded-lg p-1"
          {...register("comportamientoAsistente", {
            value: inputData ? inputData.comportamientoAsistente : "",
            onChange: (e) =>
              setInputData({
                ...inputData,
                comportamientoAsistente: e.target.value,
              }),
          })}
        />
      </Label>
      <div className="flex justify-center">
        <input
          type="submit"
          placeholder="Actualizar"
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
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  let regex = /(wsp\w+)([\?/].*)?/gm;

  useEffect(() => {
    setInputValue(regex.exec(userData.WorkspaceID)?.at(1) || "");
  }, [userData, regex]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const match = regex.exec(value);
    setIsValid(match !== null);

    if (match) {
      setInputValue(match[1]);
    } else {
      setInputValue(value);
    }
  };
  //TODO: recuerda guardar el workspace ID
  //TODO: completar el formulario
  return (
    <div className="text-black">
      <div className="flex gap-2 justify-center">
        <a
          className="border-black border-solid border-2 rounded-lg p-2"
          href="/auth/requestAuthorization"
        >
          Habilitar Airtable
        </a>
        <div className="flex flex-col justify-center gap-2">
          <div>
            <label htmlFor="regexInput">URL o ID del workspace:</label>
            <input
              id="regexInput"
              type="text"
              value={inputValue}
              onChange={handleChange}
              className="border-b-black border-b-solid border-b-2"
              style={{
                borderColor: isValid ? "black" : "red",
              }}
              disabled={userData.RefreshToken ? false : true}
            />
            {!isValid && inputValue && (
              <p style={{ color: "red" }}>Entrada Incorrecta</p>
            )}
          </div>
          <button
            disabled={!isValid}
            onClick={() => {
              let newRow = { ...userData, WorkspaceID: inputValue };
              axios.post(`/api/botpressRowUpdate`, {
                table: "UsersServicioTable",
                newRow,
                assistantType: "Servicio",
                oldRow: userData,
              });
            }}
          >
            Guardar WorkspaceID
          </button>
        </div>
      </div>
      <FormData
        userData={userData}
        table="UsersServicioTable"
        assistantType="Servicio"
      />
    </div>
  );
}
