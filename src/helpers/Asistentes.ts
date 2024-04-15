import { InputData, AssistantType } from "@/types";
import axios from "axios";

export const Asistente = {
  crear: async ({
    data,
    type,
  }: {
    data: Array<InputData>;
    type: AssistantType;
  }) => {
    const func =
      type === "Servicio" ? Asistente.crearServicio : Asistente.crearConsumo;

    return data.map(async (asistente) => await func(asistente));
  },
  actualizar: ({
    data,
    type,
  }: {
    data: Array<{ id: string; data: InputData }>;
    type: AssistantType;
  }) => {
    const func =
      type === "Servicio"
        ? Asistente.actualizarServicio
        : Asistente.actualizarConsumo;
    data.forEach((asistente) => func([asistente]));
  },

  actualizarServicio: (data: Array<{ id: string; data: InputData }>) => {
    data.forEach((asistente) => {
      axios.post(
        `https://api.openai.com/v1/assistants/${asistente.id}`,
        createAsistantServicioInfo([asistente.data])[0],
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1",
          },
        },
      );
    });
  },

  crearServicio: async (data: InputData): Promise<string> => {
    return axios
      .post(
        "https://api.openai.com/v1/assistants",
        createAsistantServicioInfo([data])[0],
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1",
          },
        },
      )
      .then((res) => res.data.id);
  },

  crearConsumo: async (data: InputData): Promise<string> => {
    return axios
      .post(
        "https://api.openai.com/v1/assistants",
        createAsistantConsumoInfo([data])[0],
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1",
          },
        },
      )
      .then((res) => res.data.id);
  },

  actualizarConsumo: (data: Array<{ id: string; data: InputData }>) => {
    data.forEach(async (asistente) => {
      await axios.post(
        `https://api.openai.com/v1/assistants/${asistente.id}`,
        createAsistantConsumoInfo([asistente.data])[0],
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Beta": "assistants=v1",
          },
        },
      );
    });
  },
};

function createAsistantConsumoInfo(data: Array<InputData>) {
  //recorrer el array de datos con su index y crear un objeto para cada asistente
  return data.map((asistente) => {
    return {
      model: "gpt-3.5-turbo",
      instructions: `# Rol\nEres el asistente virtual de un negocio del rubro ${asistente.rubro} llamado "${asistente.nombreTienda}", tu tarea será la de ayudar a los clientes a pedir comida a domicilio.\n# Datos importantes a tomar en cuenta:\n- Horario: ${asistente.horario}\n- Comportamiento: ${asistente.comportamientoAsistente}\n# Notas:\n- NUNCA te inventes un nombre o apellido, ni de un cliente, ni de un empleado.\n- El usuario puede terminar la conversación en cualquier momento, si él decide terminarla entonces utilizarás la función \"terminar-conversacion\"\n# Secuencia de la conversación\nla siguiente es una lista de la secuencia básica de una conversación con el cliente. Siéntete libre de adaptarla de manera natural:\n## Inicio\n1. **Obtener datos iniciales**: primero que nada deberás ejecutar la función \"datos-iniciales\" para saber la fecha actual, si el usuario está registrado o no a demás de la lista de productos que puede pedir el usuario.\n2. **Saludo**: una vez obtenida la información, procederás al saludo, dependiendo de si el usuario está registrado o no hay dos posibles caminos:\n- *No está registrado*: si el cliente no está registrado entonces debes preguntarle su nombre y su dirección para registrarlo en el sistema con la función \"registrar-cliente\", esto es obligatorio y no se puede proceder sin este paso, informa al usuario que esto es para su mejor atención futura.\n- *Está registrado*: si el cliente está registrado entonces lo saludarás por su nombre y si conoces cuál fue su último servicio entonces le preguntarás si quiere agendar ese mismo servicio\n## Proceso\nUna vez teniendo el nombre del usuario debemos saber qué productos quiere ordenar y la cantidad de ellos, a demás de si quiere  que el pedido sea llevado a la dirección registrada o a otra dirección a su elección, ya teniendo los datos de su orden deberás registrarla con la función \"registrar-pedido\", luego de eso pregunta al cliente si desea algo más y si no quiere nada más usar la función \"terminar-conversacion\".`,
      tools: [
        {
          type: "function",
          function: {
            name: "terminar-conversacion",
            description: "funcion para terminar el hilo de la conversacion",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "datos-iniciales",
            description:
              "devuelve un JSON con 3 parametros, fecha, el cual tiene informacion del dia, mes, año y dia de la semana actual; cliente, el cual contiene el nombre del usuario y su ultimo servicio solicitado si el mismo ya esta registrado, si no lo está entonces la propiedad cliente será false; y productos, el cual es un array que contiene los nombres de los productos disponibles y sus datos",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "registrar-pedido",
            description:
              "Función asíncrona que registra un pedido en una hoja de cálculo de Google Sheets. Devuelve 'ok' si el pedido se registra correctamente.",
            parameters: {
              type: "object",
              properties: {
                sheetName: {
                  type: "string",
                  description:
                    "Nombre de la hoja de cálculo donde se registrará el pedido, el cual siempre será el dia de hoy en formato YYYY-MM-DD.",
                },
                clienteNo: {
                  type: "string",
                  description: "Número del cliente que realiza el pedido.",
                },
                nombreCliente: {
                  type: "string",
                  description: "Nombre del cliente que realiza el pedido.",
                },
                direccionEnvio: {
                  type: "string",
                  description: "Dirección de envío para el pedido.",
                },
                nombreProducto: {
                  type: "string",
                  description: "Nombre del producto que se está pidiendo.",
                },
                precioUnitario: {
                  type: "number",
                  description: "Precio unitario del producto.",
                },
                cantidad: {
                  type: "number",
                  description: "Cantidad del producto que se está pidiendo.",
                },
              },
              required: [
                "sheetName",
                "clienteNo",
                "nombreCliente",
                "direccionEnvio",
                "nombreProducto",
                "precioUnitario",
                "cantidad",
              ],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "registrar-cliente",
            description:
              "Función asíncrona que registra un cliente en una hoja de cálculo de Google Sheets. La función realiza una solicitud POST a la API de Google Sheets para agregar los detalles del cliente a la hoja de cálculo.",
            parameters: {
              type: "object",
              properties: {
                nombre: {
                  type: "string",
                  description: "Nombre del cliente que se va a registrar.",
                },
                direccionEnvio: {
                  type: "string",
                  description:
                    "Dirección de envío del cliente que se va a registrar.",
                },
              },
              required: ["nombre", "direccionEnvio"],
            },
          },
        },
      ],
    };
  });
}

function createAsistantServicioInfo(data: Array<InputData>) {
  //recorrer el array de datos con su index y crear un objeto para cada asistente
  return data.map((asistente) => {
    return {
      model: "gpt-3.5-turbo",
      instructions: `# Rol\nEres el asistente de \"${asistente.nombreTienda}\", una ${asistente.rubro}. Tu tarea es gestionar las reservas de los clientes.\n\n# Reglas\n- Horario: ${asistente.horario}.\n- Comportamiento: ${asistente.comportamientoAsistente}.\n- No inventes nombres ni apellidos.\n- Solo agenda citas con empleados listados y dentro del horario de apertura.\n- Usa días de la semana en lugar de fechas para las funciones \"comprobar-fecha\" y \"agendar-cita\".\n- No menciones a los empleados en el saludo.\n- Necesitas el nombre del usuario para proceder.\n- Si el cliente solicita una reserva en un día de la semana, úsalo como parámetro en las funciones.\n- Las reservas deben ser a fechas futuras.\n- Si el usuario termina la conversación, usa la función \"terminar-conversacion\".\n\n# Secuencia de la conversación\n1. **Inicio**: Usa \"datos-iniciales\" para obtener la fecha y el estado de registro del usuario. Saluda al usuario y, si está registrado, pregúntale si quiere agendar el mismo servicio que la última vez. Si no está registrado, pide su nombre, regístralo con \"saveName\" y continua con el siguiente paso.\n2. **Confirmación del nombre**: Antes de proceder con la reserva, confirma con el usuario si la cita debe ser agendada a su nombre o a nombre de otra persona, debe ser un nombre propio.\n3. **Proceso**: Si el usuario quiere cancelar una cita, usa \"getReservations\" para mostrarle sus citas y \"cancelReservation\" para cancelar la seleccionada. Si no, pide el servicio requerido y usa \"getServices\" para seleccionarlo. Luego, comprueba la disponibilidad con \"comprobar-disponibilidad\" o \"comprobar-fecha\" y agenda la cita con \"agendar-cita\". Si no se puede agendar, vuelve a comprobar la disponibilidad.\n`,
      tools: [
        {
          type: "function",
          function: {
            name: "comprobar-fecha",
            description:
              "devuelve un objeto que representa los intervalos en los que cada empleado esta ocupado ese dia, si el objeto esta vacio todos los empleados estan libres, si un empleado no aparece significa que esta libre ese dia",
            parameters: {
              type: "object",
              properties: {
                dateString: {
                  type: "string",
                  description:
                    "es preferiblemente un dia de la semana o la fecha solicitada para comprobar disponibilidad puede estar en formato YYYY-MM-DD",
                },
              },
              required: ["dateString"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "terminar-conversacion",
            description: "funcion para terminar el hilo de la conversacion",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "agendar-cita",
            description:
              "funcion que permite agendar la cita que solicita el cliente, devuelve un codigo 200 si se pudo agendar y 409 si no pudo por un conflicto, antes de agendar verificar todos los datos necesarios, ningun parametro puede ser un string vacio",
            parameters: {
              type: "object",
              properties: {
                dateString: {
                  type: "string",
                  description:
                    "el dia a agendar es la fecha solicitada para agendar en ese dia, puede estar en formato YYYY-MM-DD o ser preferiblemente un dia de la semana",
                },
                horaInicio: {
                  type: "string",
                  description: "hora de inicio de la cita en formato HH:mm",
                },
                duracion: {
                  type: "number",
                  description: "duracion en minutos del servicio a agendar",
                },
                empleado: {
                  type: "string",
                  description: "nombre del empleado encargado de la cita",
                },
                servicio: {
                  type: "string",
                  description:
                    "servicio a agendar, este debe coincidir con uno de los servicios de la lista",
                },
                cliente: {
                  type: "string",
                  description: "nombre del cliente",
                },
                personaCita: {
                  type: "string",
                  description: "nombre de la persona para la cual es la cita",
                },
              },
              required: [
                "dateString",
                "horaInicio",
                "duracion",
                "empleado",
                "servicio",
                "cliente",
                "personaCita",
              ],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "comprobar-disponibilidad",
            description:
              "devuelve un objeto que representa los intervalos en los que cada empleado esta ocupado, si el objeto esta vacio todos los empleados estan libres, si un empleado no aparece significa que esta libre",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getEmpleados",
            description:
              "verifica la lista de empleados de la tienda, dedvuelve un array con los nombres de los empleados",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "saveName",
            description:
              "funcion que sirve para registrar a un cliente en el registro",
            parameters: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "el nombre del cliente a registrar",
                },
              },
              required: ["name"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getServices",
            description:
              "funcion que retorna un array de JSONs con los nombres de los servicios disponibles y sus respectivas duraciones en minutos",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getReservations",
            description:
              "funcion que retorna un array de JSONs con los datos de las reservaciones del cliente actual",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "cancelReservation",
            description:
              "funcion que recibe el id de una reservacion y la borra del registro",
            parameters: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "id de la reservacion a eliminar",
                },
              },
              required: ["id"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "datos-iniciales",
            description:
              "devuelve un JSON los datos que necesitas conocer para la conversacion",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
      ],
    };
  });
}
