
export interface Logs {
  meta: {
    total: number;
    page: number;
    size: number;
  };
  data: [CoreLog]
}

export interface CoreLog {
  timestamp: number,
  camera_id: string,
  topic: string,
  data: Info
}

export interface Info {
  timestamp: number,
  group_number: number,
  group_sizes: number[],
  people_number: number
}