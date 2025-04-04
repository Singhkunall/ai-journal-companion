# AI Journal Companion

An AI-powered digital journal companion focused on personalized journaling and mental wellbeing. This application uses the Gemini API to generate journal prompts, analyze emotions, and provide insights based on your journal entries.

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

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Google Gemini API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/singhkunall/ai-journal-companion.git
   cd ai-journal-companion
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. Run the application:
   ```
   python app.py
   ```

6. Open your browser and navigate to `http://127.0.0.1:5000`

## Usage

1. Click "Start Recording" and say "Hi Monika, I am [your name]"
2. Select your current mood from the mood selector
3. Write your journal entry or use voice recording
4. Click "Analyze Entry" to get insights about your journal entry
5. Click "Get Emotional Insights" for deeper emotional analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini API for providing the AI capabilities
- Web Speech API for voice recognition and text-to-speech functionality

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 