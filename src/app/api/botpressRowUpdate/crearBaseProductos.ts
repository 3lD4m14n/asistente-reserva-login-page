import axios from "axios";

export default async function crearBaseProductos(accessToken: string) {
  return axios
    .post(
      "https://sheets.googleapis.com/v4/spreadsheets",
      {
        properties: {
          title: "Productos",
        },
        sheets: [
          {
            properties: {
              title: "Productos",
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
