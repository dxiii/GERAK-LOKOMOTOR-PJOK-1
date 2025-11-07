export interface Movement {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Keypoint {
  x: number;
  y: number;
}

// A list of all body parts that the AI model will identify.
export type BodyPart =
  | 'nose'
  | 'left_eye'
  | 'right_eye'
  | 'left_ear'
  | 'right_ear'
  | 'left_shoulder'
  | 'right_shoulder'
  | 'left_elbow'
  | 'right_elbow'
  | 'left_wrist'
  | 'right_wrist'
  | 'left_hip'
  | 'right_hip'
  | 'left_knee'
  | 'right_knee'
  | 'left_ankle'
  | 'right_ankle';

// Represents the full skeleton with coordinates for each body part.
export type Pose = Record<BodyPart, Keypoint>;

// Provides feedback on whether a specific body part is positioned correctly.
export type PoseFeedback = Partial<Record<BodyPart, 'correct' | 'incorrect'>>;

// The complete structured response we expect from the AI analysis.
export interface AnalysisResponse {
  pose: Pose;
  feedback: PoseFeedback;
  text: string;
}
