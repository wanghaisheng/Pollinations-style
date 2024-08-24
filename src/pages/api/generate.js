export async function onRequestPost({ request }) {
  try {
    const { session_cookie_token, prompt, style, ratio } = await request.json();

    if (!session_cookie_token || !prompt) {
      return new Response('Session cookie token and prompt are required', { status: 400 });
    }

    // Define the payload and call the external API
    const payload = {
      aspect_ratio: ratio,
      channel_id: "LbF4xfurTryl5MUEZ73bDw",
      prompt: prompt,
      raw_or_fun: "raw",
      speed: "slow",
      style: style,
      user_id: "-xnquyqCVSFOYTomOeUchbw"
    };

    const startInferenceResponse = await fetch("https://ideogram.ai/api/images/sample", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_cookie=${session_cookie_token}`
      },
      body: JSON.stringify(payload)
    });

    if (!startInferenceResponse.ok) {
      throw new Error(`Failed to start inference: ${startInferenceResponse.statusText}`);
    }

    const startInferenceData = await startInferenceResponse.json();
    const requestId = startInferenceData.request_id;

    // Poll for results
    const imageData = await pollForResults(requestId, 30000); // Wait up to 30 seconds

    if (imageData) {
      return new Response(JSON.stringify({ images: imageData.images }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response('No images found', { status: 404 });
    }
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

async function pollForResults(requestId, timeout) {
  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    const imageData = await fetchGenerationMetadata(requestId);
    if (imageData) {
      return imageData;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before polling again
  }
  return null;
}

async function fetchGenerationMetadata(requestId) {
  try {
    const response = await fetch(`https://ideogram.ai/api/images/retrieve_metadata_request_id/${requestId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.resolution === 1024) {
      return data;
    }
  } catch (error) {
    console.error(`Error fetching metadata: ${error.message}`);
  }

  return null;
}
