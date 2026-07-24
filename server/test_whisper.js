const fs = require('fs');
const { transcribeAudio } = require('./services/ai/groq.service');

async function test() {
  try {
    const buffer = fs.readFileSync('package.json'); // Dummy file, Groq should throw a specific format error, not a code crash
    console.log('Testing transcribeAudio...');
    const result = await transcribeAudio(buffer, 'json');
    console.log('Result:', result);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
