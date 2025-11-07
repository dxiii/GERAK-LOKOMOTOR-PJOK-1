import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResponse } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING },
    pose: {
      type: Type.OBJECT,
      properties: {
        nose: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_eye: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_eye: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_ear: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_ear: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_shoulder: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_shoulder: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_elbow: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_elbow: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_wrist: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_wrist: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_hip: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_hip: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_knee: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_knee: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        left_ankle: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
        right_ankle: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } } },
      }
    },
    feedback: {
      type: Type.OBJECT,
      properties: {
        nose: { type: Type.STRING },
        left_eye: { type: Type.STRING },
        right_eye: { type: Type.STRING },
        left_ear: { type: Type.STRING },
        right_ear: { type: Type.STRING },
        left_shoulder: { type: Type.STRING },
        right_shoulder: { type: Type.STRING },
        left_elbow: { type: Type.STRING },
        right_elbow: { type: Type.STRING },
        left_wrist: { type: Type.STRING },
        right_wrist: { type: Type.STRING },
        left_hip: { type: Type.STRING },
        right_hip: { type: Type.STRING },
        left_knee: { type: Type.STRING },
        right_knee: { type: Type.STRING },
        left_ankle: { type: Type.STRING },
        right_ankle: { type: Type.STRING },
      }
    },
  },
  required: ['pose', 'feedback', 'text'],
};


export async function analyzeMovement(
  imageDataBase64: string,
  movementName: string
): Promise<AnalysisResponse | null> {
  try {
    const prompt = `Anda adalah seorang ahli analisa postur untuk aplikasi PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan) anak-anak.

Tugas Anda adalah menganalisa gambar seorang anak yang sedang menirukan gerakan lokomotor '${movementName}'.

Berdasarkan gambar, berikan output dalam format JSON yang valid. Jangan sertakan markdown backticks (\`\`\`json).

Struktur JSON harus mengikuti skema yang telah ditentukan.

Aturan:
1.  'pose': Deteksi 17 keypoint tubuh utama (standar COCO) dan berikan koordinat x, y yang dinormalisasi (antara 0.0 dan 1.0) dari gambar. Jika keypoint tidak terlihat, berikan x: 0, y: 0.
2.  'feedback': Bandingkan postur anak dengan postur ideal untuk gerakan '${movementName}'. Untuk setiap keypoint utama (lengan, kaki, bahu, pinggul), tentukan apakah posisinya 'correct' atau 'incorrect'.
3.  'text': Berikan satu kalimat umpan balik yang singkat, positif, dan membangun dalam Bahasa Indonesia untuk anak kelas 1 SD. Contoh: "Hebat! Coba angkat lututmu sedikit lebih tinggi lagi ya!".

Analisa gambar siswa berikut dan hasilkan JSON yang sesuai.`;

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageDataBase64,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as AnalysisResponse;

  } catch (error) {
    console.error("Error analyzing movement:", error);
    return null;
  }
}