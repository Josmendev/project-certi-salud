export interface Certificate {
  certificate_id: string;
  certificate_code: string;
  certificate_type_id: number;
  staff_id: number;
  patient_id: number;
  issue_date: string;
  rest_days: number;
  status: "Realizado" | "Anulado";
}
