from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Gemini API configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def get_gemini_response(prompt):
    headers = {
        'Content-Type': 'application/json'
    }
    
    data = {
        "contents": [{
            "parts":[{"text": prompt}]
        }]
    }
    
    response = requests.post(
        f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
        headers=headers,
        json=data
    )
    
    if response.status_code == 200:
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    else:
        raise Exception(f"API Error: {response.text}")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_prompt', methods=['POST'])
def get_prompt():
    try:
        user_input = request.json.get('user_input', '')
        mood = request.json.get('mood', '')
        
        mood_context = {
            'happy': "The user is feeling happy and positive. Generate a prompt that helps them reflect on their joy and gratitude.",
            'sad': "The user is feeling sad. Generate a prompt that helps them process their emotions and find hope.",
            'anxious': "The user is feeling anxious. Generate a prompt that helps them calm their thoughts and find peace.",
            'calm': "The user is feeling calm. Generate a prompt that helps them appreciate their inner peace and maintain it.",
            'excited': "The user is feeling excited. Generate a prompt that helps them channel their enthusiasm positively."
        }
        
        mood_instruction = mood_context.get(mood, "Generate a thoughtful journal prompt that encourages self-reflection and personal growth.")
        
        system_prompt = f"""You are an AI journal companion that provides thoughtful and engaging journal prompts. 
        {mood_instruction}
        
        Generate ONLY ONE concise, meaningful prompt in this exact format:
        
        🎯 [Title in 3-5 words]
        • [Single thought-provoking question or statement]
        
        Keep it extremely brief and impactful. The prompt should be no more than 2 lines total."""
        
        if user_input:
            prompt = f"{system_prompt}\n\nGenerate a thoughtful journal prompt based on this context: {user_input}"
        else:
            prompt = f"{system_prompt}\n\nGenerate a thoughtful journal prompt that encourages self-reflection and personal growth."

        response_text = get_gemini_response(prompt)
        return jsonify({"prompt": response_text})
    except Exception as e:
        print(f"Error in get_prompt: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/analyze_entry', methods=['POST'])
def analyze_entry():
    content = request.json.get('content', '')
    mood = request.json.get('mood', '')
    user_input = request.json.get('user_input', '')
    
    try:
        system_prompt = "You are an AI journal companion that provides empathetic and insightful analysis of journal entries. Provide a brief, meaningful analysis focusing on emotional patterns and mental wellbeing. Keep your response under 3 sentences and highlight the key insight."
        
        if user_input:
            prompt = f"{system_prompt}\n\nPlease analyze this journal entry and provide supportive insights and suggestions for mental wellbeing:\n\nContent: {content}\nMood: {mood}\nAdditional Context: {user_input}"
        else:
            prompt = f"{system_prompt}\n\nPlease analyze this journal entry and provide supportive insights and suggestions for mental wellbeing:\n\nContent: {content}\nMood: {mood}"

        response_text = get_gemini_response(prompt)
        return jsonify({
            "insights": response_text,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    except Exception as e:
        print(f"Error in analyze_entry: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/get_emotional_insights', methods=['POST'])
def get_emotional_insights():
    content = request.json.get('content', '')
    user_input = request.json.get('user_input', '')
    
    try:
        system_prompt = "You are an AI journal companion that analyzes emotional patterns and provides insights for mental wellbeing. Provide a brief, meaningful analysis of emotional patterns in 2-3 sentences. Focus on the most significant insight and keep it concise."
        
        if user_input:
            prompt = f"{system_prompt}\n\nAnalyze the emotional patterns in this journal entry and provide insights for mental wellbeing:\n\nContent: {content}\nAdditional Context: {user_input}"
        else:
            prompt = f"{system_prompt}\n\nAnalyze the emotional patterns in this journal entry and provide insights for mental wellbeing:\n\n{content}"

        response_text = get_gemini_response(prompt)
        return jsonify({
            "emotional_insights": response_text,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    except Exception as e:
        print(f"Error in get_emotional_insights: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 