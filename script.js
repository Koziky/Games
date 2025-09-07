document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");
  const audioPlayer = document.getElementById("audioPlayer");
  const downloadLink = document.getElementById("downloadLink");

  if (!prompt.trim()) {
    alert("Please enter a song idea!");
    return;
  }

  loading.classList.remove("hidden");
  result.classList.add("hidden");

  try {
    // 🔥 Replace this with your actual API call
    const response = await fakeApiCall(prompt);

    // Load audio
    audioPlayer.src = response.audioUrl;
    downloadLink.href = response.audioUrl;

    loading.classList.add("hidden");
    result.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    alert("Something went wrong while generating music.");
    loading.classList.add("hidden");
  }
});

// --- Placeholder API call function ---
async function fakeApiCall(prompt) {
  console.log("Sending to API:", prompt);

  // Simulate API delay
  await new Promise(res => setTimeout(res, 3000));

  // Return a demo audio file
  return {
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  };
}
