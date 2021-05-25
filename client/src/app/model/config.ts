export interface Config {
  min_distance_cm: number,
  fps: number,
  min_people_in_group: number,
  height_similarity: number,
  min_seconds_for_group: number,
  min_seconds_forget_group: number,
  pixel_points: {x:number,y:number}[],
  cm_points: {x:number,y:number}[]
}