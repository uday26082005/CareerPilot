async function testHttp() {
  try {
    const res = await fetch("http://localhost:5000/api/interviews/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewType: "Technical",
        difficulty: "Medium"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error(err);
  }
}

testHttp();
