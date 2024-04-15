import {Session} from "next-auth";

export type InputData = {
  rubro: string;
  nombreTienda: string;
  horario: string;
  comportamientoAsistente: string;
};

export type userInfo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  AssistantID: string;
  "Personalizacion del Asistente": InputData;
  "Personal Access Token": string;
  RefreshToken: string;
  BaseClientesID: string;
  ConversacionesIniciadas: number;
  Email: string;
};

export type userInfoServicio = userInfo & {
  WorkspaceID: string;
  BaseAgendaID: string;
  BaseServiciosID: string;
  BaseEmpleadosID: string;
};

export type userInfoConsumo = userInfo & {
  BasePedidosID: string;
  BaseProductosID: string;
};

export type AssistantType = "Servicio" | "Consumo";

export interface UserSession extends Session {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
  userInfo: userInfoServicio | userInfoConsumo;
  assistantType: AssistantType;
};
