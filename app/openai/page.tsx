'use client'
import React, { useState } from 'react'
// Import the OpenAI npm package
const OpenAI = require('openai');

// Get your API key from environment variables
const apiKey = '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';
function Openai() {
    const [text, setText] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const connectOpenai = async (text: string) => {
        const openai = new OpenAI({ apiKey: apiKey , dangerouslyAllowBrowser: true });

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": text}],
          });
          setAnswer(chatCompletion.choices[0].message.content);
    }
  return (
    <div>
        <input value={text} onChange={(e) => setText(e.target.value)}/>
        <button onClick={() => connectOpenai(text)}>submit</button>
        <div>
            {answer}
        </div>
    </div>
  )
}

export default Openai