// src/services/measurementService.ts

import apiClient from '../../Apis/apiConfig';
import { BodyMeasurement } from '../../Users/models/BodyMeasurement';


const getMeasurements = (clientId: number) => {
  console.log("id cient",clientId);
  return apiClient.get<BodyMeasurement[]>(`/clients/${clientId}/measurements`);
};

export default {
  getMeasurements,
};
