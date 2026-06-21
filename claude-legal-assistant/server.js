import express from "express";
import { askLegalAI } from "./services/claude.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Legal AI is running 🚀 Use POST /ask");
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    const response = await askLegalAI(question);

    res.json({
      answer: response.content[0].text
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

