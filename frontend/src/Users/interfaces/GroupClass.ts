

export interface GroupClass {
    id: number;
    className: string;
    startTime: string; // ISO string
    endTime: string;   // ISO string
    maxParticipants: number;
    assignedTrainer?: {
      id: number;
      user: {
        username: string;
        email: string;
      };
      specialization?: string;
    };
  }

  export interface CalendarEventDTO {
    id: number;
    title: string;
    start: string;
    end: string;
    eventType: string;
  }
  