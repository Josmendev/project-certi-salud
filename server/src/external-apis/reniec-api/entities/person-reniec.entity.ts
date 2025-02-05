export class PersonReniec {
  success: boolean;
  data: {
    numero: string;
    nombre_completo: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    codigo_verificacion: number;
    ubigeo_sunat: string;
    ubigeo: (string | null)[];
    direccion: string;
  };
  time: number;
  source: string;
}