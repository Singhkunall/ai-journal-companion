from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_prompt', methods=['POST'])
def get_prompt():
    try:
        data = request.get_json()
        user_input = data.get('user_input', '')
        mood = data.get('mood', '')
        
        # Generate prompt based on mood
        prompt = f"Generate a thoughtful journal prompt for someone feeling {mood}. The prompt should encourage self-reflection and emotional awareness."
        response = model.generate_content(prompt)
        
        return jsonify({'prompt': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze_entry', methods=['POST'])
def analyze_entry():
    try:
        data = request.get_json()
        content = data.get('content', '')
        mood = data.get('mood', '')
        
        # Analyze the journal entry
        prompt = f"Analyze this journal entry from someone feeling {mood}. Provide thoughtful insights about their emotional state and thought patterns: {content}"
        response = model.generate_content(prompt)
        
        return jsonify({'insights': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_emotional_insights', methods=['POST'])
def get_emotional_insights():
    try:
        data = request.get_json()
        content = data.get('content', '')
        
        # Generate emotional insights
        prompt = f"Analyze the emotional content of this journal entry and provide deep insights about the emotional patterns and potential areas for growth: {content}"
        response = model.generate_content(prompt)
        
        return jsonify({'emotional_insights': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Use environment variable for port if available (for production)
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 