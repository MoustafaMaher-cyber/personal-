import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateImage(prompt: string, filename: string) {
  try {
    console.log(`Generating image for: ${filename}...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const buffer = Buffer.from(base64Data, 'base64');
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir);
        }
        fs.writeFileSync(path.join(publicDir, filename), buffer);
        console.log(`Successfully saved ${filename}`);
        return;
      }
    }
    console.log(`No image data found for ${filename}`);
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
  }
}

async function main() {
  await generateImage(
    "A highly professional, photorealistic image combining artificial intelligence concepts with neuromodulation techniques. Visualizing a glowing human brain with neural networks, digital data streams, and advanced non-invasive brain stimulation devices like TMS or tDCS. Modern, clinical, high-tech, blue and teal color palette.",
    "hero.png"
  );

  await generateImage(
    "A highly professional, photorealistic image representing dedication to neuroscience clinical and research applications. A modern clinical research setting, showing a physical therapist or researcher analyzing brain scans on a high-tech transparent display, with a patient in the background receiving advanced neurological rehabilitation. Clean, bright, scientific, hopeful.",
    "about.png"
  );
}

main();
