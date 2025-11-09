export type CountryISO = 'PE' | 'CL';

export interface CreateAppointmentDTO {
  insuredId: string;
  scheduleId: number;
  countryISO: CountryISO;
}

export interface AppointmentRecord extends CreateAppointmentDTO {
  requestId: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
  payload?: any;
}
