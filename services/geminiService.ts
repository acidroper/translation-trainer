
import { GoogleGenAI, Type } from "@google/genai";
import { TranslationFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SIZES_MAP: { [key: string]: string } = {
  short: '3-4 sentences',
  medium: '5-7 sentences',
  long: '8-10 sentences',
};

const STYLE_PROMPTS: { [key: string]: string } = {
    educational: 'informative, educational, containing interesting facts',
    artistic: 'literary, descriptive, rich in imagery and metaphors',
    conversational: 'informal, dialogue-heavy, using everyday language',
    random: 'random', // Handled specifically
};

const textGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        text: {
            type: Type.STRING,
            description: "The generated coherent text in Russian.",
        }
    },
    required: ['text'],
};


export const generateText = async (topic: string, difficulty: string, size: string, style: string): Promise<string[]> => {
  const sentenceCount = SIZES_MAP[size] || '5-7 sentences';

  let selectedStylePrompt = STYLE_PROMPTS[style];

  if (style === 'random' || !selectedStylePrompt) {
      const styles = [
        'an engaging short story or narrative',
        'an interesting informative snippet or fun fact',
        'a personal diary entry or blog post',
        'a vivid description of a scene or event',
        'a piece of advice or recommendation',
        'a short dialogue narrative'
      ];
      selectedStylePrompt = styles[Math.floor(Math.random() * styles.length)];
  }
  
  const prompt = `
    Act as a creative Russian language tutor. 
    Generate a unique, cohesive, and engaging text in Russian.
    
    Parameters:
    - Topic: "${topic}"
    - Proficiency Level: "${difficulty}" (Common European Framework of Reference for Languages context)
    - Length: Approximately ${sentenceCount}.
    - Style: ${selectedStylePrompt}.

    Strict Guidelines:
    1. The text MUST be in Russian.
    2. Make it sound natural and human-like, NOT like a robotic textbook.
    3. Use diverse vocabulary and sentence structures appropriate for the '${difficulty}' level.
    4. Avoid starting consecutive sentences with the same word (e.g., avoid starting every sentence with "He" or "The").
    5. Ensure logical flow between sentences.
    6. Do NOT provide a list of bullet points. It must be a paragraph.

    Output Format:
    Respond with a JSON object containing a single key "text" with the generated Russian text string.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: textGenerationSchema,
            temperature: 1.5, // Increased for more creativity and variety
        },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    if (typeof parsedResponse.text !== 'string' || !parsedResponse.text.trim()) {
        throw new Error("API returned invalid or empty text.");
    }

    // Split text into sentences using a regex that handles various punctuation.
    // We look for a period, exclamation, or question mark followed by a space or end of string.
    // We also handle cases like "г. Москва" or initials to avoid incorrect splitting (basic heuristic).
    const rawSentences = parsedResponse.text.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [parsedResponse.text];
    
    return rawSentences.map(s => s.trim()).filter(s => s.length > 0);

  } catch (error) {
    console.error("Error calling Gemini API for text generation:", error);
    throw new Error("Failed to generate text. Please check your API key and network connection.");
  }
};


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: {
      type: Type.BOOLEAN,
      description: "Is the user's English translation grammatically and semantically correct? Ignore case sensitivity and punctuation errors. Focus on word choice and sentence structure.",
    },
    correctedTranslation: {
      type: Type.STRING,
      description: "A corrected version of the user's translation in English. This should be an empty string if the translation is already correct.",
    },
    feedback: {
      type: Type.STRING,
      description: "A concise, helpful explanation in Russian about any errors, or comments on why the translation is good. Explain grammar mistakes, stylistic issues, or better word choices. Keep the feedback in Russian.",
    },
    alternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A list of 2-3 alternative, valid translations in English. These can showcase different styles or nuances.",
    },
  },
  required: ['isCorrect', 'correctedTranslation', 'feedback', 'alternatives'],
};

export const evaluateTranslation = async (originalSentence: string, userTranslation: string): Promise<TranslationFeedback> => {
  const prompt = `
    Evaluate the following user-provided English translation of a Russian sentence.
    
    Original Russian Sentence: "${originalSentence}"
    
    User's English Translation: "${userTranslation}"
    
    Provide your evaluation in the specified JSON format. Be a helpful and encouraging language tutor. Your feedback should be in Russian.

    IMPORTANT RULES FOR EVALUATION:
    1. Ignore case sensitivity (e.g., 'apple' is the same as 'Apple').
    2. Ignore punctuation differences (e.g., missing periods, commas, or question marks should NOT count as errors unless they change the meaning drastically).
    3. Mark 'isCorrect' as true if the words and grammar are correct, even if punctuation or casing is off.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    // Basic validation
    if (typeof parsedResponse.isCorrect !== 'boolean' || !Array.isArray(parsedResponse.alternatives)) {
        throw new Error("Invalid JSON structure from API");
    }

    return parsedResponse as TranslationFeedback;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to evaluate translation. Please check your API key and network connection.");
  }
};

const wordTranslationSchema = {
    type: Type.OBJECT,
    properties: {
        translations: {
            type: Type.ARRAY,
            description: "A list of 2-4 common English translations for the given Russian word.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ['translations'],
};


export const getWordTranslations = async (word: string): Promise<string[]> => {
    const prompt = `
        Provide a few common English translations for the Russian word "${word}".
        Return the translations as a JSON object with a single key "translations" containing an array of strings.
        If the word has no direct translation, return an empty array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: wordTranslationSchema,
                temperature: 0.2,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (!Array.isArray(parsedResponse.translations)) {
            throw new Error("API returned invalid data structure for word translations.");
        }

        return parsedResponse.translations;

    } catch (error) {
        console.error(`Error fetching translation for "${word}":`, error);
        return [];
    }
};
