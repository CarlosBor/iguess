# iGuess

iGuess is a small web app that detects irony in text using a fine-tuned [CardiffNLP](https://huggingface.co/cardiffnlp/twitter-roberta-base-irony) RoBERTa model served via a FastAPI backend. It provides a frontend interface with voice input, dynamic irony scoring via a gauge, and optional user feedback to simulate model correction.

---

## Features

- 🎤 Voice-to-text input using the Web Speech API (Chrome-only)
- 🧠 Irony detection via transformer-based text classification
- 📊 Interactive gauge visualization of irony score
- 🧾 Local caching of predictions using `localStorage`
- 🗣 Feedback mechanism to simulate supervised corrections

---

## Tech Stack

### Client
- React 19
- Vite
- TypeScript
- `react-gauge-component`
- Web Speech API (built-in browser feature)

### Server
- FastAPI
- HuggingFace Transformers
- Model: `cardiffnlp/twitter-roberta-base-irony`

### DevOps
- Docker
- Docker Compose
- Node.js 20
- Python 3.11

---

## Project Structure

```
├── client/ # React frontend
│ ├── src/
│ │ └── components/
│ │ └── IronyChecker.tsx
│ └── ...
├── server/ # FastAPI backend
│ └── app.py
├── docker-compose.yml
├── README.md
└── ...
```
---

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Running the App

From the root directory:

```bash
docker compose up --build
```

Then open the app in your browser at:
http://localhost:5173

## API

### POST `/predict`

**Request Body**

```json
{
  "text": "your text here"
}
```

Response:

```json
{
  "result": [
    {
      "label": "irony",
      "score": 0.87
    }
  ]
}
```