const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { message, pdfPath } = req.body;

    // 1. Prepare the base instruction for the AI
    const promptText = `You are an expert AI tutor and assistant. Answer the user's question. If a document is attached, base your answer heavily on the contents of that document. \n\nUser Question: ${message}`;
    
    // This array will hold our text prompt AND our PDF file
    let contentArray = [promptText];

    // 2. If a PDF path was sent, feed the raw file DIRECTLY to Gemini!
    if (pdfPath) {
      const fullPath = path.join(__dirname, '../', pdfPath);
      
      if (fs.existsSync(fullPath)) {
        console.log("📄 Attaching PDF directly to Gemini's vision...");
        
        // Read the file and convert it to Base64 (the language Gemini understands for files)
        const fileData = fs.readFileSync(fullPath).toString("base64");
        
        const pdfPart = {
          inlineData: {
            data: fileData,
            mimeType: "application/pdf"
          }
        };
        
        // Add the PDF directly to the message payload
        contentArray.push(pdfPart);
        console.log("✅ PDF Attached Successfully!");
      } else {
        console.log("⚠️ PDF file not found at path:", fullPath);
      }
    }

    // 3. Send the Text + PDF to Gemini
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(contentArray);
    const response = await result.response;
    const text = response.text();

    // 4. Send the answer back to the frontend
    res.json({ text });

  } catch (error) {
    console.error("❌ Chat API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

module.exports = router;



// @route   POST /api/chat/quiz
router.post('/quiz', async (req, res) => {
  try {
    const { pdfPath } = req.body;

    // Strict instructions to force Gemini into JSON mode
    const promptText = `You are an expert AI tutor. Generate a 3-question multiple-choice quiz based ONLY on the attached document. 
    Return the result strictly as a raw JSON array of objects. Do not use markdown formatting or backticks. 
    Schema: [{"question": "...", "options": ["...", "...", "...", "..."], "answer": "Exact string of correct option", "explanation": "..."}]`;
    
    let contentArray = [promptText];

    if (pdfPath) {
      const fullPath = path.join(__dirname, '../', pdfPath);
      if (fs.existsSync(fullPath)) {
        const fileData = fs.readFileSync(fullPath).toString("base64");
        contentArray.push({ inlineData: { data: fileData, mimeType: "application/pdf" } });
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(contentArray);
    
    // Clean up any stray markdown formatting Gemini might sneak in
    let cleanText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse the JSON string back into a real JavaScript array
    const quizData = JSON.parse(cleanText);
    res.json({ quiz: quizData });

  } catch (error) {
    console.error("❌ Quiz API Error:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});