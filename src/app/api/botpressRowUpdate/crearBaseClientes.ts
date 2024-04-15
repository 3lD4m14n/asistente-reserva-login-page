import axios from "axios";

export default async function crearBaseClientes(accessToken: string) {
  return axios
    .post(
      "https://sheets.googleapis.com/v4/spreadsheets",
      {
        properties: {
          title: "Clientes",
        },
        sheets: [
          {
            properties: {
              title: "Clientes",
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then((res) => res.data.spreadsheetId);
}
