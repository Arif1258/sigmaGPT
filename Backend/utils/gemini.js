// A utility function to handle API calls to the Google Gemini model.
import "dotenv/config";

// This function now accepts an array of messages to maintain conversation history.
const getGeminiAPIResponse = async(messages) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // The request body uses a 'contents' array with a 'parts' array.
            // Map the messages from the chat history to the format Gemini expects.
            contents: messages.map(msg => ({
                role: msg.role === "user" ? "user" : "model", // Gemini uses 'model' for assistant role.
                parts: [{
                    text: msg.content
                }]
            }))
        })
    };

    try {
        // Updated the model name to use the 'gemini-2.5-flash-preview-05-20' model.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        return data.candidates[0].content.parts[0].text;
    } catch(err) {
        console.error("Failed to get response from Gemini API:", err);
        throw err;
    }
}

export default getGeminiAPIResponse;
