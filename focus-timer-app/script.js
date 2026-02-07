class PomodoroTimer {
    constructor() {
        this.workDuration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes in seconds
        this.longBreakDuration = 15 * 60; // 15 minutes
        this.sessionsBeforeLongBreak = 4;
        this.currentSession = 0;
        this.isWorkTime = true;
        this.isRunning = false;
        this.timeLeft = this.workDuration;
        this.timerInterval = null;
        this.completedSessions = 0;
        this.totalFocusTime = 0;
        this.currentStreak = 1;
        
        this.audioContext = null;
        this.soundSources = {};
        this.activeSounds = new Set();
        
        this.initializeElements();
        this.loadProgress();
        this.initializeAudio();
        this.updateDisplay();
        this.createSessionDots();
    }

    initializeElements() {
        // Timer elements
        this.timeDisplay = document.getElementById('time-display');
        this.timerStatus = document.getElementById('timer-status');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.skipBtn = document.getElementById('skip-btn');
        
        // Settings elements
        this.workDurationInput = document.getElementById('work-duration');
        this.breakDurationInput = document.getElementById('break-duration');
        this.longBreakInput = document.getElementById('long-break');
        this.sessionsBeforeLongInput = document.getElementById('sessions-before-long');
        
        // Progress elements
        this.completedSessionsDisplay = document.getElementById('completed-sessions');
        this.totalFocusTimeDisplay = document.getElementById('total-focus-time');
        this.currentStreakDisplay = document.getElementById('current-streak');
        this.sessionDotsContainer = document.getElementById('session-dots');
        
        // Sound elements
        this.soundOptions = document.querySelectorAll('.sound-option');
        this.notification = document.getElementById('notification');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.skipBtn.addEventListener('click', () => this.skipSession());
        
        // Settings event listeners
        this.workDurationInput.addEventListener('change', (e) => {
            this.workDuration = parseInt(e.target.value) * 60;
            if (!this.isRunning && this.isWorkTime) {
                this.timeLeft = this.workDuration;
                this.updateDisplay();
            }
        });
        
        this.breakDurationInput.addEventListener('change', (e) => {
            this.breakDuration = parseInt(e.target.value) * 60;
            if (!this.isRunning && !this.isWorkTime) {
                this.timeLeft = this.breakDuration;
                this.updateDisplay();
            }
        });
        
        this.longBreakInput.addEventListener('change', (e) => {
            this.longBreakDuration = parseInt(e.target.value) * 60;
        });
        
        this.sessionsBeforeLongInput.addEventListener('change', (e) => {
            this.sessionsBeforeLongBreak = parseInt(e.target.value);
            this.createSessionDots();
        });
        
        // Sound event listeners
        this.soundOptions.forEach(option => {
            const playBtn = option.querySelector('.play-btn');
            const volumeSlider = option.querySelector('.volume-slider');
            const soundType = option.dataset.sound;
            
            playBtn.addEventListener('click', () => this.toggleSound(soundType, playBtn));
            volumeSlider.addEventListener('input', (e) => this.adjustVolume(soundType, e.target.value));
        });
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSoundBuffers();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    createSoundBuffers() {
        // Create oscillator-based sounds for different ambient sounds
        const soundTypes = ['rain', 'coffee', 'white', 'nature'];
        
        soundTypes.forEach(type => {
            const source = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Different frequencies for different sounds
            switch(type) {
                case 'rain':
                    source.frequency.value = 100;
                    break;
                case 'coffee':
                    source.frequency.value = 150;
                    break;
                case 'white':
                    source.type = 'white';
                    break;
                case 'nature':
                    source.frequency.value = 200;
                    break;
            }
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.value = 0;
            
            this.soundSources[type] = { source, gainNode };
            source.start();
        });
    }

    toggleSound(soundType, button) {
        if (!this.audioContext) return;
        
        const sound = this.soundSources[soundType];
        if (!sound) return;
        
        const isPlaying = this.activeSounds.has(soundType);
        
        if (isPlaying) {
            sound.gainNode.gain.value = 0;
            this.activeSounds.delete(soundType);
            button.innerHTML = '<i class="fas fa-play"></i>';
            button.parentElement.parentElement.classList.remove('active');
        } else {
            sound.gainNode.gain.value = 0.1;
            this.activeSounds.add(soundType);
            button.innerHTML = '<i class="fas fa-stop"></i>';
            button.parentElement.parentElement.classList.add('active');
        }
    }

    adjustVolume(soundType, volume) {
        if (!this.audioContext || !this.soundSources[soundType]) return;
        
        const normalizedVolume = volume / 100 * 0.3; // Max 30% volume
        this.soundSources[soundType].gainNode.gain.value = normalizedVolume;
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.timerStatus.textContent = this.isWorkTime ? 'Focus Time! 💪' : 'Break Time! ☕';
            
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.completeSession();
                }
            }, 1000);
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.timerStatus.textContent = 'Paused';
            clearInterval(this.timerInterval);
        }
    }

    resetTimer() {
        this.pauseTimer();
        this.isWorkTime = true;
        this.timeLeft = this.workDuration;
        this.currentSession = 0;
        this.updateDisplay();
        this.timerStatus.textContent = 'Ready to Focus';
        this.createSessionDots();
    }

    skipSession() {
        this.completeSession();
    }

    completeSession() {
        this.pauseTimer();
        
        if (this.isWorkTime) {
            this.completedSessions++;
            this.totalFocusTime += this.workDuration / 60;
            this.currentSession++;
            
            if (this.currentSession >= this.sessionsBeforeLongBreak) {
                this.isWorkTime = false;
                this.timeLeft = this.longBreakDuration;
                this.timerStatus.textContent = 'Long Break Time! 🌴';
                this.showNotification('Great work! Time for a long break!');
                this.currentSession = 0;
            } else {
                this.isWorkTime = false;
                this.timeLeft = this.breakDuration;
                this.timerStatus.textContent = 'Break Time! ☕';
                this.showNotification('Session complete! Take a short break.');
            }
            
            // Update streak
            const today = new Date().toDateString();
            const lastCompleted = localStorage.getItem('lastCompletedDate');
            if (lastCompleted === today) {
                // Already completed today
            } else if (lastCompleted === new Date(Date.now() - 86400000).toDateString()) {
                // Completed yesterday
                this.currentStreak++;
            } else {
                // Missed a day
                this.currentStreak = 1;
            }
            localStorage.setItem('lastCompletedDate', today);
            
        } else {
            this.isWorkTime = true;
            this.timeLeft = this.workDuration;
            this.timerStatus.textContent = 'Focus Time! 💪';
            this.showNotification('Break over! Back to work!');
        }
        
        this.saveProgress();
        this.updateProgressDisplay();
        this.createSessionDots();
        this.playNotificationSound();
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Visual feedback when time is running low
        if (this.timeLeft < 60 && this.isRunning) {
            this.timeDisplay.style.color = '#e74c3c';
            this.timeDisplay.style.animation = 'pulse 1s infinite';
        } else {
            this.timeDisplay.style.color = '';
            this.timeDisplay.style.animation = '';
        }
    }

    createSessionDots() {
        this.sessionDotsContainer.innerHTML = '';
        const totalSessions = this.sessionsBeforeLongBreak;
        
        for (let i = 0; i < totalSessions; i++) {
            const dot = document.createElement('div');
            dot.className = 'session-dot';
            dot.textContent = i + 1;
            
            if (i < this.currentSession) {
                dot.classList.add('completed');
            } else if (i === this.currentSession && !this.isWorkTime) {
                dot.classList.add('completed');
            } else if (i === this.currentSession && this.isWorkTime) {
                dot.classList.add('current');
            }
            
            this.sessionDotsContainer.appendChild(dot);
        }
    }

    updateProgressDisplay() {
        this.completedSessionsDisplay.textContent = this.completedSessions;
        this.totalFocusTimeDisplay.textContent = `${Math.round(this.totalFocusTime)} min`;
        this.currentStreakDisplay.textContent = `${this.currentStreak} day${this.currentStreak !== 1 ? 's' : ''}`;
    }

    showNotification(message) {
        const notificationText = document.getElementById('notification-text');
        notificationText.textContent = message;
        this.notification.classList.add('show');
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    playNotificationSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        
        // Create a chime effect
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    saveProgress() {
        const progress = {
            completedSessions: this.completedSessions,
            totalFocusTime: this.totalFocusTime,
            currentStreak: this.currentStreak,
            lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('pomodoroProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('pomodoroProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                const lastUpdate = new Date(progress.lastUpdate);
                const today = new Date();
                
                // Reset if it's a new day
                if (lastUpdate.toDateString() !== today.toDateString()) {
                    this.completedSessions = 0;
                    this.totalFocusTime = 0;
                } else {
                    this.completedSessions = progress.completedSessions || 0;
                    this.totalFocusTime = progress.totalFocusTime || 0;
                }
                
                this.currentStreak = progress.currentStreak || 1;
                this.updateProgressDisplay();
            } catch (e) {
                console.warn('Could not load progress:', e);
            }
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});