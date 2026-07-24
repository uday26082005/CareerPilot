const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('./services/ai/groq.service');
const fs = require('fs');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post("/test", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file" });
    }
    const text = await transcribeAudio(req.file.buffer, 'webm');
    res.json({ text });
  } catch (err) {
    console.error("End to End Error:", err);
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(5005, async () => {
  console.log("Server listening on 5005");
  
  // Create a 1-byte dummy webm file
  fs.writeFileSync('dummy.webm', Buffer.from([0x00]));

  const FormData = require('form-data');
  const axios = require('axios');
  
  try {
    const form = new FormData();
    form.append('audio', fs.createReadStream('dummy.webm'), {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });

    const res = await axios.post('http://localhost:5005/test', form, {
      headers: form.getHeaders(),
    });
    console.log("Response:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Axios Error Response:", err.response.data);
    } else {
      console.error("Axios Error:", err.message);
    }
  } finally {
    server.close();
  }
});
