import { Asistente } from "@/helpers/Asistentes";
import { headersForBotpress } from "@/helpers/headersForBotpress";
import { AssistantType, userInfoConsumo, userInfoServicio } from "@/types";
import axios from "axios";
import { crearBaseClientesGoogleSheets } from "./crearBaseClientes";
import crearBasePedidos from "./crearBasePedidos";
import crearBaseProductos from "./crearBaseProductos";
import {
  crearBaseAgendaAirtable,
  crearBaseClientesAirtable,
  crearBaseEmpleadosAirtable,
  crearBaseServiciosAirtable,
} from "./crearBasesAirtable";

export async function POST(request: Request) {
  const {
    table,
    newRow,
    oldRow,
    assistantType,
    airtableWorkspaceID,
  }: {
    table: string;
    newRow: userInfoConsumo | userInfoServicio;
    oldRow: userInfoConsumo | userInfoServicio;
    assistantType: AssistantType;
    airtableWorkspaceID?: string;
  } = await request.json();

  if (!table) return new Response("Missing table", { status: 400 });
  if (!newRow) return new Response("Missing newRow", { status: 400 });
  if (!oldRow) return new Response("Missing oldRow", { status: 400 });

  if (assistantType === "Consumo" && "BasePedidosID" in newRow) {
    if (newRow.BaseClientesID === null)
      newRow.BaseClientesID = await crearBaseClientesGoogleSheets(
        oldRow["Personal Access Token"],
      );
    if (newRow.BasePedidosID === null)
      newRow.BasePedidosID = await crearBasePedidos(
        oldRow["Personal Access Token"],
      );
    if (newRow.BaseProductosID === null)
      newRow.BaseProductosID = await crearBaseProductos(
        oldRow["Personal Access Token"],
      );
  }

  console.log("newRow:\n", newRow, "\noldRow:\n", oldRow, "assistantType:\n", assistantType, "airtableWorkspaceID:\n", airtableWorkspaceID);
  if (
    assistantType === "Servicio" &&
    airtableWorkspaceID &&
    "BaseAgendaID" in newRow
  ) {
    console.log("newRow:\n", newRow, "\noldRow:\n", oldRow);

    if (newRow.BaseAgendaID === null)
      newRow.BaseAgendaID = await crearBaseAgendaAirtable(
        airtableWorkspaceID,
        oldRow["Personal Access Token"],
      );
    if (newRow.BaseServiciosID === null)
      newRow.BaseServiciosID = await crearBaseServiciosAirtable(
        airtableWorkspaceID,
        oldRow["Personal Access Token"],
      );
    if (newRow.BaseEmpleadosID === null)
      newRow.BaseEmpleadosID = await crearBaseEmpleadosAirtable(
        airtableWorkspaceID,
        oldRow["Personal Access Token"],
      );
    if (newRow.BaseClientesID === null)
      newRow.BaseClientesID = await crearBaseClientesAirtable(
        airtableWorkspaceID,
        oldRow["Personal Access Token"],
      );
  }

  if (!oldRow.AssistantID) {
    newRow.AssistantID = await Asistente.crear({
      type: assistantType,
      data: [newRow["Personalizacion del Asistente"]],
    }).then((res) => res[0]);
  } else {
    Asistente.actualizar({
      type: assistantType,
      data: [
        {
          id: oldRow.AssistantID,
          data: newRow["Personalizacion del Asistente"],
        },
      ],
    });
  }

  axios.put(
    `https://api.botpress.cloud/v1/tables/${table}/rows`,
    {
      rows: [newRow],
    },
    { headers: headersForBotpress },
  );

  return new Response("OK", { status: 200 });
}
