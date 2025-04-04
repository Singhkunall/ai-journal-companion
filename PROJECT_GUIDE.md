# AI Journal Companion - Complete Project Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Local Development Setup](#local-development-setup)
5. [Deployment Guide](#deployment-guide)
6. [Usage Guide](#usage-guide)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

## Project Overview

AI Journal Companion is a web application that helps users maintain a digital journal with AI-powered features. It uses the Google Gemini API to generate personalized journal prompts, analyze emotions, and provide insights based on journal entries. The application also includes voice recognition and text-to-speech capabilities for a more interactive experience.

## Features

- **Personalized Journal Prompts**: Get AI-generated prompts based on your current mood
- **Emotional Analysis**: Analyze your journal entries for emotional patterns and insights
- **Voice Assistant**: Use voice commands to interact with the application
- **Personalized Greeting**: The AI assistant recognizes your name and greets you personally
- **Mood-Based Theming**: The UI adapts to your selected mood with appropriate colors and styling
- **Text-to-Speech**: Have prompts and insights read aloud to you

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **AI**: Google Gemini API
- **Voice Recognition**: Web Speech API
- **Styling**: Bootstrap, Custom CSS
- **Deployment**: Render.com, Gunicorn

## Local Development Setup

### Prerequisites

- Python 3.8 or higher
- Google Gemini API key
- Git

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Singhkunall/ai-journal-companion.git
   cd ai-journal-companion
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Run the application locally**:
   ```bash
   python app.py
   ```

6. **Access the application**:
   Open your browser and navigate to `http://127.0.0.1:5000`

## Deployment Guide

### Deploying to Render.com

1. **Sign up for Render**:
   - Go to https://render.com
   - Create a new account or sign in

2. **Connect your GitHub repository**:
   - In the Render dashboard, click "New +" and select "Web Service"
   - Connect your GitHub account if not already connected
   - Select the "ai-journal-companion" repository

3. **Configure the deployment**:
   - Name: ai-journal-companion
   - Environment: Python
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Plan: Free

4. **Add environment variables**:
   - Click on the "Environment" tab
   - Add `GEMINI_API_KEY` with your API key value

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Your application will be available at the provided URL

### Deployment Files

The following files are used for deployment:

- **gunicorn.conf.py**: Configuration for the Gunicorn production server
  ```python
  workers = 4
  bind = "0.0.0.0:10000"
  timeout = 120
  ```

- **render.yaml**: Render deployment configuration
  ```yaml
  services:
    - type: web
      name: ai-journal-companion
      env: python
      buildCommand: pip install -r requirements.txt
      startCommand: gunicorn app:app
      envVars:
        - key: PYTHON_VERSION
          value: 3.8.0
        - key: GEMINI_API_KEY
          sync: false
  ```

## Usage Guide

### Getting Started

1. **Initial Greeting**:
   - Click "Start Recording" and say "Hi Monika, I am [your name]"
   - The AI will greet you by name and ask how you're feeling

2. **Selecting Your Mood**:
   - Choose from the available mood options (Happy, Sad, Anxious, Calm, Excited)
   - The UI will adapt to your selected mood

3. **Getting Journal Prompts**:
   - After selecting your mood, the AI will generate a personalized prompt
   - You can click "Speak" to have the prompt read aloud

4. **Writing Journal Entries**:
   - Write your entry in the text area or use voice recording
   - Click "Analyze Entry" to get insights about your entry
   - Click "Get Emotional Insights" for deeper emotional analysis

5. **Voice Commands**:
   - Use "Start Recording" to begin voice input
   - Use "Stop Recording" to end voice input
   - The AI will automatically analyze your entry after voice input

### Voice Assistant Features

- **Speech Recognition**: The application uses the Web Speech API for voice input
- **Text-to-Speech**: Prompts and insights can be read aloud
- **Personalized Greeting**: The AI recognizes your name and greets you personally

## Troubleshooting

### Common Issues

1. **API Key Issues**:
   - Ensure your Gemini API key is correctly set in the `.env` file
   - Check that the key has the necessary permissions

2. **Voice Recognition Problems**:
   - Ensure your browser supports the Web Speech API
   - Check that your microphone is properly connected and has permissions
   - Try using a different browser if issues persist

3. **Deployment Issues**:
   - Check the Render logs for error messages
   - Verify that all environment variables are correctly set
   - Ensure the build and start commands are correct

### Getting Help

If you encounter issues not covered here:
- Check the GitHub repository for updates
- Open an issue on the GitHub repository
- Contact the maintainers for support

## Contributing

We welcome contributions to the AI Journal Companion project! Here's how you can contribute:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Commit your changes with clear commit messages
5. Push to your fork
6. Create a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

This guide is maintained by the AI Journal Companion team. For the latest updates, visit the [GitHub repository](https://github.com/Singhkunall/ai-journal-companion). 