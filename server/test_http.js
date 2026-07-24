const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function test() {
  try {
    const form = new FormData();
    // Read any dummy file and append it as webm
    form.append('audio', fs.createReadStream('package.json'), {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });

    // Note: We need a valid token since requireAuth is enabled. Wait, I'll bypass requireAuth for this test or just use the local file.
    // Actually, I just need to know if the user got 400 or 500. Let's look at the logs of the actual server.
  } catch (err) {
    console.error(err);
  }
}
