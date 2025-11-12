# RAG-search
RAG Data Search - Retrieve and generate insights from any structured dataset using natural language queries powered by Google Gemini API

## 🚀 Live Demo

**[View Live Application](https://rag-search.vercel.app/)**

The application is deployed on Vercel and can be accessed at: https://rag-search.vercel.app/

## 📋 Overview

RAG Search is a powerful web application that allows you to upload structured datasets (CSV, JSON, Excel) and query them using natural language. Powered by Google's Gemini API, it retrieves relevant information and generates intelligent insights from your data.

## ✨ Features

- **Natural Language Queries**: Ask questions about your data in plain English
- **Multiple File Formats**: Support for CSV, JSON, and Excel files
- **AI-Powered Insights**: Leverages Google Gemini API for intelligent data analysis
- **Real-time Search**: Get instant results from your uploaded datasets
- **Modern UI**: Clean and intuitive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI/ML**: Google Generative AI (Gemini API)
- **Data Processing**: XLSX, JSZip, PDFjs-dist
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Villain-vvr/RAG-search.git
cd RAG-search
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## 🌐 Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 📝 Usage

1. **Upload Your Data**: Click "Choose File" and select a CSV, JSON, or Excel file
2. **Enter Your Query**: Type your question in natural language
3. **Get Results**: Click "Search" to retrieve insights from your data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Villain-vvr**

- GitHub: [@Villain-vvr](https://github.com/Villain-vvr)

## 🙏 Acknowledgments

- Google Generative AI for the Gemini API
- Vercel for hosting
- All contributors and supporters of this project
