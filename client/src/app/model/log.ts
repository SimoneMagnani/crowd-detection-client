
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
  group_number: number,
  group_sizes: number[],
  people_number: number
}