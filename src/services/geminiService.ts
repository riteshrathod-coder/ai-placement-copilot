import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const analyzeResume = async (input: string | { data: string, mimeType: string }) => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const part = typeof input === 'string' 
    ? { text: `Analyze the following resume text. 
    Perform the following:
    1. Skill Detection: Identify all technical and soft skills.
    2. Authenticity Check: Identify generic phrases, buzzwords, or AI-generated patterns.
    3. Job Role Suggestions: Suggest 3-5 job roles that fit this profile.
    4. Learning Resources: For identified skill gaps or suggested roles, provide 3-5 free learning resource links (e.g., Coursera, YouTube, MDN).
    5. Scoring: Provide scores (0-100) for Fit, Authenticity, Clarity, Impact, and Relevance.
    6. Extraction: Extract the full text as 'extractedText'.

    Resume Text:
    ${input}` }
    : {
        inlineData: {
          data: input.data,
          mimeType: input.mimeType
        }
      };

  const promptPart = typeof input === 'string' 
    ? null 
    : { text: `Analyze this resume file. 
    Perform the following:
    1. Skill Detection: Identify all technical and soft skills.
    2. Authenticity Check: Identify generic phrases, buzzwords, or AI-generated patterns.
    3. Job Role Suggestions: Suggest 3-5 job roles that fit this profile.
    4. Learning Resources: For identified skill gaps or suggested roles, provide 3-5 free learning resource links (e.g., Coursera, YouTube, MDN).
    5. Scoring: Provide scores (0-100) for Fit, Authenticity, Clarity, Impact, and Relevance.
    6. Extraction: Extract the full text as 'extractedText'.` };

  const contents = promptPart ? [part, promptPart] : [part];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              fit: { type: Type.NUMBER },
              authenticity: { type: Type.NUMBER },
              clarity: { type: Type.NUMBER },
              impact: { type: Type.NUMBER },
              relevance: { type: Type.NUMBER },
            },
            required: ["fit", "authenticity", "clarity", "impact", "relevance"],
          },
          summary: { type: Type.STRING },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          authenticityFeedback: { type: Type.STRING },
          suggestedRoles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          learningResources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                platform: { type: Type.STRING },
              },
              required: ["title", "url", "platform"],
            },
          },
          extractedText: { type: Type.STRING },
        },
        required: ["scores", "summary", "skills", "authenticityFeedback", "suggestedRoles", "learningResources", "extractedText"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI");
  }
};

export const matchJobWithResume = async (resumeText: string, jobDescription: string) => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare the following resume against the job description. 
    Perform the following:
    1. Fit Score Calculation: Calculate a score (0-100) based on matched skills vs required skills.
    2. Skill Gap Detection: List specific missing skills or certifications.
    3. Placement Probability: Calculate a weighted probability (0-100) of being hired, considering experience level, skill match, and clarity of the resume.
    4. Explanation: Provide a brief justification for the scores.

    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchProbability: { type: Type.NUMBER, description: "Fit score based on skills" },
          placementProbability: { type: Type.NUMBER, description: "Weighted hiring probability" },
          explanation: { type: Type.STRING },
          missingSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["matchProbability", "placementProbability", "explanation", "missingSkills"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid response from AI");
  }
};
