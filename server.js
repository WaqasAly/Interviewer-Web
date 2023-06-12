const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const configuration = new Configuration({
  organization: 'org-I8VFQVR960VLJHsFCXe81osA',
  apiKey: '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'
});

const openai = new OpenAIApi(configuration);

// Global messages array
const messages = [];
let currentModel = 'gpt-3.5-turbo';

app.use('/', express.static('static'));

// Route for handling chat messages
app.post('/chat', (req, res) => {
  const { prompt } = req.body;

  if (prompt.toLowerCase() === 'refresh') {
    // Clear conversation memory
    messages.length = 0;
    messages.push({ role: 'system', content: 'Assume you are a customer of an insurance company calling their contact center! Ask me a question about the status of your own payment. Only ask question, nothing else. Do not ask to assist me, you are the customer' });
    return res.json({ reply: 'Chat has been refreshed.' });
  }

  messages.push({ role: 'user', content: prompt });

  openai.createChatCompletion({
    model: currentModel,
    messages
  })
    .then((data) => {
      const aiResponse = data.data.choices[0].message.content;

      // Save the AI response to the messages array
      messages.push({ role: 'system', content: aiResponse });

      res.json({ reply: aiResponse });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    });
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
