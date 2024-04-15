import { Asistente } from "@/helpers/Asistentes";
import { headersForBotpress } from "@/helpers/headersForBotpress";
import { AssistantType, userInfoConsumo, userInfoServicio } from "@/types";
import axios from "axios";
import crearBaseClientes from "./crearBaseClientes";
import crearBasePedidos from "./crearBasePedidos";
import crearBaseProductos from "./crearBaseProductos";

export async function PUT(request: Request) {
  const {
    table,
    newRow,
    oldRow,
    assistantType,
  }: {
    table: string;
    newRow: userInfoConsumo | userInfoServicio;
    oldRow: userInfoConsumo | userInfoServicio;
    assistantType: AssistantType;
  } = await request.json();

  if (!table) return new Response("Missing table", { status: 400 });
  if (!newRow) return new Response("Missing newRow", { status: 400 });
  if (!oldRow) return new Response("Missing oldRow", { status: 400 });

  if (assistantType === "Consumo" && "BasePedidosID" in newRow) {
    if (!newRow.BaseClientesID)
      newRow.BaseClientesID = await crearBaseClientes(
        oldRow["Personal Access Token"],
      );
    if (!newRow.BasePedidosID)
      newRow.BasePedidosID = await crearBasePedidos(
        oldRow["Personal Access Token"],
      );
    if (!newRow.BaseProductosID)
      newRow.BaseProductosID = await crearBaseProductos(
        oldRow["Personal Access Token"],
      );
  }

  if (!oldRow.AssistantID) {
    newRow.AssistantID = await Asistente.crear({
      type: assistantType,
      data: [ newRow["Personalizacion del Asistente"] ],
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
