
export interface Logs {
  total_pages: number,
  next_page: number,
  total: number,
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