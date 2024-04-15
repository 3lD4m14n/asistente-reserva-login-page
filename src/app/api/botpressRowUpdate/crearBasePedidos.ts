import { getYYYYMMDD } from "@/helpers/getYYYY-MM-DD";
import axios from "axios";

export default async function crearBasePedidos(accessToken: string) {
  return axios.post(
    "https://sheets.googleapis.com/v4/spreadsheets",
    {
      properties: {
        title: "Pedidos",
      },
      sheets: [
        {
          properties: {
            title: getYYYYMMDD(),
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ).then((res) => res.data.spreadsheetId);
}
