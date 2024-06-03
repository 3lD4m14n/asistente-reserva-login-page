import axios from "axios";

const AIRTABLE_API_URL = "https://api.airtable.com/v0/meta/bases";

interface Field {
  name: string;
  type: string;
  options?: object;
}

interface Table {
  name: string;
  fields: Field[];
}

const createBaseWithTable = async (
  workspaceId: string,
  PersonalAccessToken: string,
  baseName: string,
  table: Table,
) => {
  const url = AIRTABLE_API_URL;
  const headers = {
    Authorization: `Bearer ${PersonalAccessToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    name: baseName,
    tables: [table],
    workspaceId: workspaceId,
  };

  const response = await axios.post(url, data, { headers });
  console.log("Base and table created:", response.data);
  return response.data["id"];
};

const crearBaseAgendaAirtable = async (
  workspaceId: string,
  PersonalAccessToken: string,
) => {
  const table: Table = {
    name: "Citas",
    fields: [
      {
        name: "Day",
        type: "date",
        options: {
          dateFormat: {
            format: "YYYY-MM-DD",
            name: "iso",
          },
        },
      },
      {
        name: "Inicio",
        type: "singleLineText",
      },
      {
        name: "Fin",
        type: "singleLineText",
      },
      {
        name: "Telefono Cliente",
        type: "phoneNumber",
      },
      {
        name: "Servicio",
        type: "singleLineText",
      },
      {
        name: "Empleado",
        type: "singleLineText",
      },{
        name: "Persona",
        type: "singleLineText",
      },
    ],
  };

  return await createBaseWithTable(
    workspaceId,
    PersonalAccessToken,
    "Agenda",
    table,
  );
};

const crearBaseClientesAirtable = async (
  workspaceId: string,
  PersonalAccessToken: string,
) => {
  const table: Table = {
    name: "Clientes",
    fields: [
      {
        name: "Numero de Telefono",
        type: "phoneNumber",
      },
      {
        name: "Nombre",
        type: "singleLineText",
      },
      {
        name: "Ultimo Servicio",
        type: "singleLineText",
      },
    ],
  };

  return await createBaseWithTable(
    workspaceId,
    PersonalAccessToken,
    "Clientes",
    table,
  );
};

const crearBaseServiciosAirtable = async (
  workspaceId: string,
  PersonalAccessToken: string,
) => {
  const table: Table = {
    name: "Servicios",
    fields: [
      {
        name: "Servicio",
        type: "singleLineText",
      },
      {
        name: "Duracion",
        type: "number",
        options: {
          precision: 0,
        },
      },
    ],
  };

  return await createBaseWithTable(
    workspaceId,
    PersonalAccessToken,
    "Servicios",
    table,
  );
};

const crearBaseEmpleadosAirtable = async (
  workspaceId: string,
  PersonalAccessToken: string,
) => {
  const table: Table = {
    name: "Empleados",
    fields: [
      {
        name: "Nombre",
        type: "singleLineText",
      },
    ],
  };

  return await createBaseWithTable(
    workspaceId,
    PersonalAccessToken,
    "Empleados",
    table,
  );
};

export {
  crearBaseAgendaAirtable,
  crearBaseClientesAirtable,
  crearBaseServiciosAirtable,
  crearBaseEmpleadosAirtable,
};
