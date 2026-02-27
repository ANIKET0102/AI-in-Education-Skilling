const User = require('../models/User');
// 🚀 Import your AI configuration (e.g., Google Generative AI or OpenAI)
// const { generateAIResponse } = require('../services/aiService'); 

// 1. GENERATE THE PLAN (Using the prompt you wrote)
exports.generatePlanner = async (req, res) => {
  try {
    const { subjects } = req.body; // ['AICampus', 'EduAI', 'React Portfolio']

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ error: "No subjects provided for planning." });
    }

    const prompt = `
      You are an expert academic planner.
      STRICT RULES:
      1. ONLY use the following subjects: ${subjects.join(", ")}.
      2. DO NOT include generic subjects like Mathematics, History, or Science.
      3. Create a 5-day study schedule (Monday to Friday) with one subject per day.
      4. Respond ONLY with a JSON object containing a "schedule" array. 
         Format: { "schedule": [{ "id": 1, "day": "Monday", "subject": "SubjectName", "topic": "Specific Topic", "time": "2 Hours", "completed": false }] }
    `;

    // 🚀 CALL YOUR AI MODEL HERE
    // const aiResponse = await generateAIResponse(prompt); 
    // const parsedSchedule = JSON.parse(aiResponse);

    // For now, if you are testing, ensure the AI isn't returning a static string
    res.status(200).json({ schedule: parsedSchedule.schedule });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: "AI failed to generate a custom plan." });
  }
};

// 2. SAVE THE PLAN (Correct as per your code)
exports.savePlanner = async (req, res) => {
  try {
    const { schedule } = req.body;
    await User.findByIdAndUpdate(req.user, { savedSchedule: schedule });
    res.status(200).json({ message: "Schedule saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving schedule" });
  }
};

// 3. GET THE SAVED PLAN (Correct as per your code)
exports.getSavedPlanner = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({ schedule: user.savedSchedule || [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule" });
  }
};