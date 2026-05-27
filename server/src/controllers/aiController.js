const Task = require('../models/tasks');
const Message = require('../models/message');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getCoachAdvice = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'message content is required' });
        }

        await Message.create({
            userId: req.user.id,
            sender: 'user',
            text: message
        });

        const userTasks = await Task.find({ owner: req.user.id });
        const taskListString = userTasks.map(task =>
            `- [${task.completed ? 'COMPLETED' : 'PENDING'}] Name: ${task.name} | Description: ${task.description || 'None'}`
        ).join('\n');

        const recentMessages = await Message.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10);
        
        const historyString = recentMessages.reverse().map(msg => 
            `${msg.sender === 'user' ? 'User' : 'Apex Coach'}: ${msg.text}`
        ).join('\n');

        const systemPrompt = `
            You are Apex Coach, a focused, highly effective time-management and accountability AI assistant.
            Your job is to provide direct, motivational, and strategic productivity advice to the user.

            Here is the user's current live checklist from the database:
            ${taskListString || "The user has no tasks logged in their list currently."}

            Here is the recent conversation history for context:
            ${historyString}

            Analyze their schedule, keep your answer crisp, and address their latest message below:
            "${message}"
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt,
        });

        await Message.create({
            userId: req.user.id,
            sender: 'ai',
            text: response.text
        });

        return res.status(200).json({ reply: response.text });
    } 
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const history = await Message.find({ userId: req.user.id }).sort({ createdAt: 1 });
        return res.status(200).json(history);
    } 
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getCoachAdvice,
    getChatHistory
};