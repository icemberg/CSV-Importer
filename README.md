# 🚀 GrowEasy AI-Powered CSV Importer

**Live Demo:** [https://csvtocrmimporter.onrender.com/](https://csvtocrmimporter.onrender.com/)

An intelligent CSV-to-CRM converter that uses Google Gemini AI to map **any** CSV format into GrowEasy CRM lead records. Upload CSVs from Facebook, Google Ads, real estate CRMs, marketing tools, or manually created spreadsheets — the AI handles the column mapping.

## ✨ Features

- **🤖 AI-Powered Field Mapping** — Gemini 3.1 Flash Lite intelligently maps arbitrary column names to CRM fields
- **📤 Drag & Drop Upload** — Intuitive file upload with drag & drop and file picker
- **📊 CSV Preview** — Beautiful table with sticky headers, scrolling, and row/column counts
- **📋 Results Dashboard** — Summary stats, imported records table, skipped records view
- **💾 CSV Export** — Download extracted CRM records as CSV
- **🌙 Dark Mode** — Toggle between light and dark themes
- **📱 Responsive Design** — Works on desktop, tablet, and mobile
- **🔄 Retry Mechanism** — Automatic retries with exponential backoff for failed AI batches
- **📦 Batch Processing** — Handles large CSVs by splitting into configurable batches
- **🐳 Docker Ready** — Docker Compose setup for easy deployment

## 📁 Project Structure

```
├── frontend/                 # Next.js 15 frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   │   ├── CsvImporter.jsx      # Main wizard orchestrator
│   │   │   ├── UploadStep.jsx       # Drag & drop upload
│   │   │   ├── PreviewStep.jsx      # CSV data preview table
│   │   │   ├── ProgressIndicator.jsx # AI processing animation
│   │   │   ├── ResultsStep.jsx      # Results display
│   │   │   └── ThemeToggle.jsx      # Dark/light mode toggle
│   │   └── lib/
│   │       └── api.js        # Backend API client
│   └── tailwind.config.js    # Tailwind CSS v3 config
│
├── backend/                  # Express.js backend
│   └── src/
│       ├── index.js          # Server entry point
│       ├── routes/           # API routes
│       ├── controllers/      # Request handlers
│       ├── services/         # Business logic
│       │   ├── csv.service.js    # CSV parsing
│       │   ├── ai.service.js     # Gemini AI extraction
│       │   └── prompt.js         # AI prompt engineering
│       └── utils/
│           └── retry.js      # Retry with backoff
│
├── sample-csvs/              # Test CSV files
│   ├── facebook_leads.csv
│   ├── google_ads.csv
│   └── real_estate_crm.csv
│
├── docker-compose.yml        # Docker setup
└── README.md
```

## 🛠 Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+
- **Google Gemini API Key** — [Get one free](https://aistudio.google.com/apikey)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd groweasy-csv-importer
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm install
npm run dev
```

The backend runs on `http://localhost:3001`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`

### 4. Open the App

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Setup

```bash
# Set your API key and configuration
export GEMINI_API_KEY=your_key_here
export GEMINI_MODEL=gemini-3.1-flash-lite
export CORS_ORIGINS=http://localhost:3000
export NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Build and run the containers
docker-compose up --build -d
```

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `GEMINI_API_KEY` | — | **Required.** Google Gemini API key |
| `GEMINI_MODEL` | `gemini-3.1-flash-lite` | The Gemini model to use for extraction |
| `PORT` | `3001` | Server port |
| `BATCH_SIZE` | `25` | Records per AI batch |
| `MAX_RETRIES` | `3` | Max retry attempts per batch |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed frontend domains (comma separated) |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Backend API URL (Must be set at build-time for Docker!) |

## 📡 API Reference

### `POST /api/import`

Upload a CSV file for AI-powered CRM extraction.

**Request:** `multipart/form-data` with field `file` (CSV file, max 10MB)

**Response:**

```json
{
  "success": true,
  "data": {
    "records": [
      {
        "created_at": "2026-05-13 14:20:48",
        "name": "John Doe",
        "email": "john@example.com",
        "country_code": "+91",
        "mobile_without_country_code": "9876543210",
        "company": "GrowEasy",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "lead_owner": "test@gmail.com",
        "crm_status": "GOOD_LEAD_FOLLOW_UP",
        "crm_note": "Client is asking to reschedule demo",
        "data_source": "",
        "possession_time": "",
        "description": ""
      }
    ],
    "skipped": [],
    "summary": {
      "totalProcessed": 4,
      "totalImported": 4,
      "totalSkipped": 0
    }
  }
}
```

### `GET /api/health`

Health check endpoint.

## 🧪 Testing with Sample CSVs

Three sample CSV files are provided in `sample-csvs/`:

1. **`facebook_leads.csv`** — Simulates a Facebook Lead Ads export
2. **`google_ads.csv`** — Simulates a Google Ads lead form export
3. **`real_estate_crm.csv`** — Simulates a real estate CRM with multiple emails/phones

## 🎯 CRM Fields

| Field | Description |
|-------|-------------|
| `created_at` | Lead creation date |
| `name` | Lead name |
| `email` | Primary email |
| `country_code` | Country code (+91, +1, etc.) |
| `mobile_without_country_code` | Mobile without country code |
| `company` | Company name |
| `city` | City |
| `state` | State |
| `country` | Country |
| `lead_owner` | Lead owner/agent email |
| `crm_status` | GOOD_LEAD_FOLLOW_UP \| DID_NOT_CONNECT \| BAD_LEAD \| SALE_DONE |
| `crm_note` | Notes, remarks, extra contacts |
| `data_source` | leads_on_demand \| meridian_tower \| eden_park \| varah_swamy \| sarjapur_plots |
| `possession_time` | Property possession time |
| `description` | Additional description |

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, JavaScript |
| Styling | Tailwind CSS v3 |
| Backend | Node.js, Express |
| AI | Google Gemini 3.1 Flash Lite |
| CSV Parsing | PapaParse (client) + csv-parse (server) |
| Icons | Lucide React |

## 📝 License

MIT
