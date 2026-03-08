import { Groq } from "groq-sdk";

// Use environment variable for the API key
// In Vite, this should be VITE_GROQ_API_KEY
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
  apiKey: apiKey || "YOUR_GROQ_API_KEY_HERE",
  dangerouslyAllowBrowser: true, // Required for client-side usage, but warn user!
});

export const groqService = {
  /**
   * Generates sample JSON data based on the provided schema.
   */
  async generateSampleData(schema: any[], count: number = 5): Promise<any[]> {
    if (!apiKey) {
      throw new Error("Groq API Key (VITE_GROQ_API_KEY) is not configured.");
    }

    const prompt = `
      You are an expert data generator. Generate exactly ${count} rows of sample data in JSON format based on the following Excel schema:
      ${JSON.stringify(schema, null, 2)}

      Rules:
      1. Return ONLY a valid JSON array of objects.
      2. No markdown formatting, no explanations.
      3. Ensure data types match the schema (Number, String, Date, Boolean, Enum).
      4. For "Enum" type, use only the provided options.
      5. For "Date" type, use YYYY-MM-DD format.
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile", // Updated from llama3-70b-8192
        temperature: 0.1,
      });

      const content = completion.choices[0]?.message?.content || "[]";
      // Clean possible markdown backticks
      const cleaned = content.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Groq AI Error (Data Generation):", error);
      throw error;
    }
  },

  /**
   * Suggests an Excel-style formula based on the column name and context.
   */
  async suggestFormula(
    columnName: string,
    allColumns: any[],
    context: string = "",
  ): Promise<string> {
    if (!apiKey) {
      throw new Error("Groq API Key (VITE_GROQ_API_KEY) is not configured.");
    }

    const prompt = `
      You are an Excel formula expert. Suggest a single Excel formula for a column named "${columnName}".
      The other columns available are: ${allColumns.map((c) => c.name).join(", ")}.
      User Context/Intent: ${context}

      Rules:
      1. Return ONLY the formula starting with "=".
      2. No markdown, no explanations.
      3. Use standard Excel function names.
      4. Refer to other columns by their names if needed (the generator will map them to letters).
      
      Example: If columnName is "Total" and other columns are "Price", "Qty", return "=PRODUCT(Price, Qty)" or "=Price * Qty".
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant", // Updated from llama3-8b-8192
        temperature: 0.1,
      });

      return completion.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
      console.error("Groq AI Error (Formula Suggestion):", error);
      throw error;
    }
  },

  /**
   * Generates a full schema (columns) based on a natural language description.
   */
  async generateSchema(description: string): Promise<any[]> {
    if (!apiKey) {
      throw new Error("Groq API Key (VITE_GROQ_API_KEY) is not configured.");
    }

    const prompt = `
      You are an expert Excel template architect. Create a structured Excel schema (list of columns) based on this description: "${description}"

      Rules:
      1. Return ONLY a valid JSON array of objects representing columns.
      2. No markdown formatting, no explanations.
      3. Each column object MUST have:
         - "id": string (unique)
         - "name": string
         - "type": "String" | "Number" | "Date" | "Boolean" | "Enum"
         - "options": (only for Enum type) array of {value: string, label: string}
         - "isFormula": boolean (optional)
         - "formula": string (starting with =, only if isFormula is true)
      4. Try to include at least one calculated formula column if it makes sense.
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile", // Updated from llama3-70b-8192
        temperature: 0.2,
      });

      const content = completion.choices[0]?.message?.content || "[]";
      const cleaned = content.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Groq AI Error (Schema Generation):", error);
      throw error;
    }
  },
};
