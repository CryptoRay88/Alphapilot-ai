require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🔹 Get market data + generate signals
app.get("/signals", async (req, res) => {
  try {
    const response = await axios.get("https://api.sosovalue.com/market", {
      headers: {
        Authorization: `Bearer ${process.env.SOSOVALUE_API_KEY}`
      }
    });

    const tokens = response.data.tokens || [];

    const signals = tokens
      .filter(t => t.volume_change_24h > 15)
      .map(t => ({
        symbol: t.symbol,
        volume_change: t.volume_change_24h,
        price: t.price,
        signal: "Volume spike detected"
      }));

    res.json(signals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 AI explanation
app.post("/explain", async (req, res) => {
  const { signal } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Explain this crypto trading signal in simple terms and why it matters: ${JSON.stringify(signal)}`
        }
      ]
    });

    res.json({
      explanation: completion.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});