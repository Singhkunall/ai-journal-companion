document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const getPromptBtn = document.getElementById('get-prompt');
    const aiPromptDiv = document.getElementById('ai-prompt');
    const journalText = document.getElementById('journal-text');
    const analyzeEntryBtn = document.getElementById('analyze-entry');
    const getInsightsBtn = document.getElementById('get-insights');
    const aiInsightsDiv = document.getElementById('ai-insights');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const insightsPlaceholder = document.querySelector('.insights-placeholder');
    const waveformAnimation = document.getElementById('waveform-animation');
    const moodSelector = document.querySelector('.mood-selector');

    let selectedMood = '';
    let userName = '';
    let isGreetingMode = true;

    // Add animation to elements when they appear
    const animateElements = () => {
        const elements = document.querySelectorAll('.sidebar, .journal-container, .insights-container');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    };

    // Set initial styles for animation
    document.querySelectorAll('.sidebar, .journal-container, .insights-container').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Run animation
    animateElements();

    // Mood selection with animation and theme switching
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            moodButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.transform = 'scale(1)';
            });
            
            // Add selected class to clicked button
            this.classList.add('selected');
            this.style.transform = 'scale(1.05)';
            
            // Store selected mood
            selectedMood = this.dataset.mood;
            
            // Apply mood-based theme
            document.body.setAttribute('data-theme', selectedMood);
            
            // Add pulse animation to prompt box if it has content
            if (aiPromptDiv.textContent !== 'Click to get a journal prompt') {
                aiPromptDiv.classList.add('highlight');
                setTimeout(() => {
                    aiPromptDiv.classList.remove('highlight');
                }, 2000);
            }

            // If in greeting mode, speak the mood selection
            if (isGreetingMode) {
                const moodText = this.textContent.trim();
                speakText(`I see you're feeling ${moodText}. Let me get a prompt for you.`, null);
                
                // Get a prompt automatically
                setTimeout(() => {
                    getPromptBtn.click();
                }, 1500);
                
                // Exit greeting mode
                isGreetingMode = false;
            }
        });
    });

    // Get AI Prompt with loading animation
    getPromptBtn.addEventListener('click', async function() {
        // Add loading state to button
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Generating...';
        this.disabled = true;
        
        // Add loading animation to prompt box
        aiPromptDiv.innerHTML = '<div class="loading-animation"><i class="bi bi-arrow-repeat spin"></i> Generating your prompt...</div>';
        
        try {
            const response = await fetch('/get_prompt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_input: journalText.value,
                    mood: selectedMood
                })
            });
            const data = await response.json();
            if (data.prompt) {
                // Format the prompt with proper HTML structure
                const formattedPrompt = data.prompt
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line)
                    .join('<br>');
                
                // Fade in the new prompt
                aiPromptDiv.style.opacity = '0';
                setTimeout(() => {
                    aiPromptDiv.innerHTML = formattedPrompt;
                    aiPromptDiv.classList.add('highlight');
                    aiPromptDiv.style.opacity = '1';
                    
                    // Apply mood-specific styling
                    if (selectedMood) {
                        aiPromptDiv.setAttribute('data-mood', selectedMood);
                    } else {
                        aiPromptDiv.removeAttribute('data-mood');
                    }
                    
                    // Remove highlight after animation
                    setTimeout(() => {
                        aiPromptDiv.classList.remove('highlight');
                    }, 2000);
                    
                    // If in greeting mode, speak the prompt
                    if (isGreetingMode) {
                        speakText(data.prompt, null);
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error getting prompt:', error);
            aiPromptDiv.innerHTML = '<div class="error-message"><i class="bi bi-exclamation-triangle"></i> Error getting prompt. Please try again.</div>';
        } finally {
            // Restore button state
            this.innerHTML = originalText;
            this.disabled = false;
        }
    });

    // Analyze Journal Entry with loading animation
    analyzeEntryBtn.addEventListener('click', async function() {
        if (!journalText.value.trim()) {
            showNotification('Please write something in your journal first.', 'warning');
            return;
        }

        // Add loading state to button
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-search spin"></i> Analyzing...';
        this.disabled = true;
        
        // Add loading animation to insights box
        if (insightsPlaceholder) {
            insightsPlaceholder.style.display = 'none';
        }
        aiInsightsDiv.innerHTML = '<div class="loading-animation"><i class="bi bi-arrow-repeat spin"></i> Analyzing your entry...</div>';
        
        try {
            const response = await fetch('/analyze_entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: journalText.value,
                    mood: selectedMood
                })
            });
            const data = await response.json();
            if (data.insights) {
                // Fade in the new insights
                aiInsightsDiv.style.opacity = '0';
                setTimeout(() => {
                    aiInsightsDiv.innerHTML = `<p><strong>Analysis:</strong> ${data.insights}</p>`;
                    aiInsightsDiv.style.opacity = '1';
                }, 300);
            }
        } catch (error) {
            console.error('Error analyzing entry:', error);
            aiInsightsDiv.innerHTML = '<div class="error-message"><i class="bi bi-exclamation-triangle"></i> Error analyzing entry. Please try again.</div>';
        } finally {
            // Restore button state
            this.innerHTML = originalText;
            this.disabled = false;
        }
    });

    // Get Emotional Insights with loading animation
    getInsightsBtn.addEventListener('click', async function() {
        if (!journalText.value.trim()) {
            showNotification('Please write something in your journal first.', 'warning');
            return;
        }

        // Add loading state to button
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-graph-up spin"></i> Generating...';
        this.disabled = true;
        
        // Add loading animation to insights box
        if (insightsPlaceholder) {
            insightsPlaceholder.style.display = 'none';
        }
        aiInsightsDiv.innerHTML = '<div class="loading-animation"><i class="bi bi-arrow-repeat spin"></i> Generating emotional insights...</div>';
        
        try {
            const response = await fetch('/get_emotional_insights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: journalText.value
                })
            });
            const data = await response.json();
            if (data.emotional_insights) {
                // Fade in the new insights
                aiInsightsDiv.style.opacity = '0';
                setTimeout(() => {
                    aiInsightsDiv.innerHTML = `<p><strong>Emotional Insights:</strong> ${data.emotional_insights}</p>`;
                    aiInsightsDiv.style.opacity = '1';
                }, 300);
            }
        } catch (error) {
            console.error('Error getting emotional insights:', error);
            aiInsightsDiv.innerHTML = '<div class="error-message"><i class="bi bi-exclamation-triangle"></i> Error getting emotional insights. Please try again.</div>';
        } finally {
            // Restore button state
            this.innerHTML = originalText;
            this.disabled = false;
        }
    });

    // Voice Recognition Setup
    let recognition = null;
    const startRecordingBtn = document.getElementById('start-recording');
    const stopRecordingBtn = document.getElementById('stop-recording');
    const recordingStatus = document.getElementById('recording-status');

    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = function() {
            startRecordingBtn.disabled = true;
            stopRecordingBtn.disabled = false;
            recordingStatus.textContent = 'Recording...';
            recordingStatus.classList.add('active');
            
            // Show waveform animation
            waveformAnimation.style.display = 'flex';
            
            // Add animation to the recording button
            startRecordingBtn.classList.add('recording-active');
        };
        
        recognition.onend = function() {
            startRecordingBtn.disabled = false;
            stopRecordingBtn.disabled = true;
            recordingStatus.classList.remove('active');
            
            // Hide waveform animation
            waveformAnimation.style.display = 'none';
            
            // Remove animation from the recording button
            startRecordingBtn.classList.remove('recording-active');
            
            // Automatically analyze the entry and get emotional insights after voice input
            if (journalText.value.trim()) {
                // Show notification that analysis is starting
                showNotification('Analyzing your journal entry...', 'info');
                
                // Automatically trigger analysis and insights
                setTimeout(() => {
                    // First analyze the entry
                    analyzeJournalEntry();
                    
                    // Then get emotional insights after a short delay
                    setTimeout(() => {
                        getEmotionalInsights();
                    }, 1000);
                }, 500);
            }
        };
        
        recognition.onresult = function(event) {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            // Check for greeting pattern
            if (isGreetingMode) {
                // Look for patterns like "hi monika i am [name]" or "hello monika my name is [name]"
                const nameMatch = transcript.match(/(?:hi|hello)\s+(?:monika|monica)\s+(?:i\s+am|my\s+name\s+is)\s+([a-zA-Z]+)/i);
                
                if (nameMatch && nameMatch[1]) {
                    userName = nameMatch[1];
                    // Stop recording after name is detected
                    recognition.stop();
                    
                    // Greet the user
                    setTimeout(() => {
                        const greeting = `Hello ${userName}! How are you feeling today?`;
                        speakText(greeting, null);
                        
                        // Highlight the mood selector to guide the user
                        moodSelector.classList.add('highlight');
                        setTimeout(() => {
                            moodSelector.classList.remove('highlight');
                        }, 3000);
                    }, 1000);
                } else {
                    // If no name detected, just update the journal text
                    journalText.value = transcript;
                }
            } else {
                // Normal journal entry mode
                journalText.value = transcript;
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            recordingStatus.textContent = `Error: ${event.error}`;
            setTimeout(() => {
                recordingStatus.textContent = '';
            }, 3000);
        };
    } else {
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = true;
        recordingStatus.textContent = 'Speech recognition not supported in this browser';
    }

    // Event listeners for voice recording buttons
    startRecordingBtn.addEventListener('click', () => {
        if (recognition) {
            // Reset to greeting mode if no name is set
            if (!userName) {
                isGreetingMode = true;
                journalText.value = '';
                showNotification('Please say "Hi Monika, I am [your name]"', 'info');
            }
            recognition.start();
        }
    });

    stopRecordingBtn.addEventListener('click', () => {
        if (recognition) {
            recognition.stop();
        }
    });

    // Text-to-Speech Setup
    const speakPromptBtn = document.getElementById('speak-prompt');
    const speakInsightsBtn = document.getElementById('speak-insights');
    let speechSynthesis = window.speechSynthesis;
    let speaking = false;

    // Function to speak text
    function speakText(text, button) {
        if (speaking) {
            speechSynthesis.cancel();
            speaking = false;
            if (button) {
                button.innerHTML = '<i class="bi bi-volume-up"></i> Speak';
                button.classList.remove('speaking');
            }
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Get available voices and set to a female voice if available
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speaking = true;
        if (button) {
            button.innerHTML = '<i class="bi bi-volume-mute"></i> Stop';
            button.classList.add('speaking');
        }
        
        utterance.onend = function() {
            speaking = false;
            if (button) {
                button.innerHTML = '<i class="bi bi-volume-up"></i> Speak';
                button.classList.remove('speaking');
            }
        };
        
        speechSynthesis.speak(utterance);
    }

    // Event listeners for speak buttons
    speakPromptBtn.addEventListener('click', () => {
        const promptText = aiPromptDiv.textContent;
        if (promptText && promptText !== 'Click to get a journal prompt') {
            speakText(promptText, speakPromptBtn);
        }
    });

    speakInsightsBtn.addEventListener('click', () => {
        const insightsText = aiInsightsDiv.textContent;
        if (insightsText && insightsText !== 'Your insights will appear here...') {
            speakText(insightsText, speakInsightsBtn);
        }
    });

    // Load voices when they're available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = function() {
            speechSynthesis.getVoices();
        };
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="bi bi-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Function to analyze journal entry (extracted from click handler)
    async function analyzeJournalEntry() {
        if (!journalText.value.trim()) {
            showNotification('Please write something in your journal first.', 'warning');
            return;
        }

        // Add loading animation to insights box
        if (insightsPlaceholder) {
            insightsPlaceholder.style.display = 'none';
        }
        aiInsightsDiv.innerHTML = '<div class="loading-animation"><i class="bi bi-arrow-repeat spin"></i> Analyzing your entry...</div>';
        
        try {
            const response = await fetch('/analyze_entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: journalText.value,
                    mood: selectedMood
                })
            });
            const data = await response.json();
            if (data.insights) {
                // Fade in the new insights
                aiInsightsDiv.style.opacity = '0';
                setTimeout(() => {
                    aiInsightsDiv.innerHTML = `<p><strong>Analysis:</strong> ${data.insights}</p>`;
                    aiInsightsDiv.style.opacity = '1';
                    
                    // Automatically speak the analysis
                    speakText(data.insights, speakInsightsBtn);
                }, 300);
            }
        } catch (error) {
            console.error('Error analyzing entry:', error);
            aiInsightsDiv.innerHTML = '<div class="error-message"><i class="bi bi-exclamation-triangle"></i> Error analyzing entry. Please try again.</div>';
        }
    }

    // Function to get emotional insights (extracted from click handler)
    async function getEmotionalInsights() {
        if (!journalText.value.trim()) {
            showNotification('Please write something in your journal first.', 'warning');
            return;
        }
        
        // Add loading animation to insights box
        if (insightsPlaceholder) {
            insightsPlaceholder.style.display = 'none';
        }
        aiInsightsDiv.innerHTML = '<div class="loading-animation"><i class="bi bi-arrow-repeat spin"></i> Generating emotional insights...</div>';
        
        try {
            const response = await fetch('/get_emotional_insights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: journalText.value
                })
            });
            const data = await response.json();
            if (data.emotional_insights) {
                // Fade in the new insights
                aiInsightsDiv.style.opacity = '0';
                setTimeout(() => {
                    aiInsightsDiv.innerHTML = `<p><strong>Emotional Insights:</strong> ${data.emotional_insights}</p>`;
                    aiInsightsDiv.style.opacity = '1';
                    
                    // Automatically speak the emotional insights
                    speakText(data.emotional_insights, speakInsightsBtn);
                }, 300);
            }
        } catch (error) {
            console.error('Error getting emotional insights:', error);
            aiInsightsDiv.innerHTML = '<div class="error-message"><i class="bi bi-exclamation-triangle"></i> Error getting emotional insights. Please try again.</div>';
        }
    }
    
    // Initial greeting
    setTimeout(() => {
        showNotification('Click "Start Recording" and say "Hi Monika, I am [your name]"', 'info');
    }, 2000);
}); 