
# 🏛️ AI-Driven Research Engine for Commercial Courts

## Project Overview

This project is an intelligent legal research system designed for Commercial Courts in India. It leverages AI (Google Gemini) and the Indian Kanoon legal database to provide:
- Commercial case analysis
- Key legal issues and relevant laws
- Predictive analytics for case outcomes
- Data localization for different High Courts
- Multilingual support (English/Hindi)
- Ethical AI (facilitator, not decision-maker)

## Code Structure

- `client/` — React frontend for user interaction
	- `src/App.js` — Main UI and logic for legal research
	- `public/` — Static assets
- `server/` — Node.js backend API
	- `index.js` — Express server, Gemini AI integration, Indian Kanoon API calls
- `mlsamp.py` — Python script for PDF law document aggregation

## How to Run

### 1. Install Dependencies

Navigate to the project root and run:

```bash
npm install
```

### 2. Set Environment Variables

Create a `.env` file in the `server/` directory with:

```
GEMINI_API_KEY=your_gemini_api_key
IK_TOKEN=your_indian_kanoon_api_token
```

### 3. Start the Backend Server

```bash
cd client/server
node index.js
```

### 4. Start the Frontend

```bash
cd ../
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Required NPM Modules

- express
- cors
- dotenv
- node-fetch
- @google/genai
- react
- axios

## Usage

1. Enter a commercial dispute query in the UI
2. Select case type, jurisdiction, and language
3. View AI-powered analysis, relevant cases, and predictive analytics

## Security

- **Do NOT commit your `.env` file or API keys to GitHub**
- `node_modules/` and `.env` are excluded by `.gitignore`
