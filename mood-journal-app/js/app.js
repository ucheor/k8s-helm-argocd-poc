class MoodJournal {
    constructor() {
        this.currentMood = null;
        this.selectedTags = new Set();
        this.currentDate = new Date();
        
        this.initializeElements();
        this.initializeDatePicker();
        this.loadEntries();
        this.updateRecentEntries();
        this.setupEventListeners();
    }

    initializeElements() {
        // Form elements
        this.moodOptions = document.querySelectorAll('.mood-option');
        this.tagOptions = document.querySelectorAll('.tag-option');
        this.selectedTagsContainer = document.getElementById('selected-tags');
        this.customTagInput = document.getElementById('custom-tag-input');
        this.addTagBtn = document.getElementById('add-tag-btn');
        this.journalTextarea = document.getElementById('journal-textarea');
        this.wordCount = document.getElementById('word-count');
        this.charCount = document.getElementById('char-count');
        
        // Buttons
        this.saveBtn = document.getElementById('save-entry');
        this.clearBtn = document.getElementById('clear-entry');
        this.viewEntriesBtn = document.getElementById('view-entries');
        
        // Display elements
        this.entriesList = document.getElementById('entries-list');
        this.toast = document.getElementById('toast');
        
        // Calendar elements (if on calendar page)
        this.currentMonthEl = document.querySelector('.current-month');
        this.calendarGrid = document.querySelector('.calendar-grid');
        this.prevMonthBtn = document.querySelector('.prev-month');
        this.nextMonthBtn = document.querySelector('.next-month');
    }

    initializeDatePicker() {
        flatpickr("#entry-date", {
            dateFormat: "Y-m-d",
            defaultDate: new Date(),
            onChange: (selectedDates) => {
                this.currentDate = selectedDates[0];
            }
        });
    }

    setupEventListeners() {
        // Mood selection
        this.moodOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.moodOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.currentMood = option.dataset.mood;
            });
        });

        // Tag selection
        this.tagOptions.forEach(option => {
            option.addEventListener('click', () => {
                const tag = option.dataset.tag;
                if (this.selectedTags.has(tag)) {
                    this.selectedTags.delete(tag);
                    option.classList.remove('selected');
                } else {
                    this.selectedTags.add(tag);
                    option.classList.add('selected');
                }
                this.updateSelectedTags();
            });
        });

        // Custom tag
        this.addTagBtn.addEventListener('click', () => {
            const tag = this.customTagInput.value.trim();
            if (tag) {
                this.selectedTags.add(tag.toLowerCase());
                this.updateSelectedTags();
                this.customTagInput.value = '';
            }
        });

        this.customTagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTagBtn.click();
            }
        });

        // Text area updates
        this.journalTextarea.addEventListener('input', () => {
            this.updateTextCounters();
        });

        // Save entry
        this.saveBtn.addEventListener('click', () => this.saveEntry());

        // Clear entry
        this.clearBtn.addEventListener('click', () => this.clearForm());

        // Load more entries if on calendar page
        if (this.prevMonthBtn && this.nextMonthBtn) {
            this.prevMonthBtn.addEventListener('click', () => this.changeMonth(-1));
            this.nextMonthBtn.addEventListener('click', () => this.changeMonth(1));
            this.renderCalendar();
        }
    }

    updateTextCounters() {
        const text = this.journalTextarea.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = text.length;
        
        this.wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        this.charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    }

    updateSelectedTags() {
        this.selectedTagsContainer.innerHTML = '';
        this.selectedTags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'selected-tag';
            tagEl.innerHTML = `
                ${tag}
                <span class="remove-tag" data-tag="${tag}">×</span>
            `;
            this.selectedTagsContainer.appendChild(tagEl);
        });

        // Add remove functionality
        this.selectedTagsContainer.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;
                this.selectedTags.delete(tag);
                
                // Also deselect from tag options
                this.tagOptions.forEach(option => {
                    if (option.dataset.tag === tag) {
                        option.classList.remove('selected');
                    }
                });
                
                this.updateSelectedTags();
            });
        });
    }

    saveEntry() {
        if (!this.currentMood) {
            this.showToast('Please select a mood', 'warning');
            return;
        }

        const entry = {
            id: Date.now(),
            date: this.currentDate.toISOString().split('T')[0],
            mood: this.currentMood,
            tags: Array.from(this.selectedTags),
            text: this.journalTextarea.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Get existing entries
        const entries = this.getEntries();
        entries.push(entry);
        
        // Save to localStorage
        localStorage.setItem('moodJournalEntries', JSON.stringify(entries));
        
        this.showToast('Entry saved successfully!', 'success');
        this.clearForm();
        this.updateRecentEntries();
        
        // If on calendar page, refresh calendar
        if (this.calendarGrid) {
            this.renderCalendar();
        }
    }

    clearForm() {
        this.moodOptions.forEach(o => o.classList.remove('selected'));
        this.tagOptions.forEach(o => o.classList.remove('selected'));
        this.selectedTags.clear();
        this.journalTextarea.value = '';
        this.currentMood = null;
        this.updateSelectedTags();
        this.updateTextCounters();
        
        // Reset date to today
        flatpickr("#entry-date", {
            dateFormat: "Y-m-d",
            defaultDate: new Date()
        });
    }

    getEntries() {
        const entries = localStorage.getItem('moodJournalEntries');
        return entries ? JSON.parse(entries) : [];
    }

    loadEntries() {
        const entries = this.getEntries();
        return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    updateRecentEntries() {
        const entries = this.loadEntries().slice(0, 5);
        this.entriesList.innerHTML = '';

        if (entries.length === 0) {
            this.entriesList.innerHTML = '<p class="no-entries">No entries yet. Start journaling!</p>';
            return;
        }

        entries.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'entry-item';
            
            // Get mood emoji
            const moodEmoji = this.getMoodEmoji(entry.mood);
            
            // Truncate text for preview
            const previewText = entry.text.length > 100 
                ? entry.text.substring(0, 100) + '...' 
                : entry.text;

            entryEl.innerHTML = `
                <div class="entry-header">
                    <span class="entry-date">${this.formatDate(entry.date)}</span>
                    <span class="entry-mood">${moodEmoji}</span>
                </div>
                ${entry.tags.length > 0 ? `
                    <div class="entry-tags">
                        ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="entry-preview">
                    ${previewText}
                </div>
            `;
            
            entryEl.addEventListener('click', () => {
                this.loadEntryForEditing(entry);
            });
            
            this.entriesList.appendChild(entryEl);
        });
    }

    getMoodEmoji(mood) {
        const emojiMap = {
            'happy': '😊',
            'excited': '🤩',
            'calm': '😌',
            'neutral': '😐',
            'sad': '😔',
            'anxious': '😰',
            'angry': '😠',
            'tired': '😴'
        };
        return emojiMap[mood] || '😐';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    loadEntryForEditing(entry) {
        // Set mood
        this.moodOptions.forEach(o => {
            o.classList.remove('selected');
            if (o.dataset.mood === entry.mood) {
                o.classList.add('selected');
            }
        });
        this.currentMood = entry.mood;

        // Set tags
        this.selectedTags = new Set(entry.tags);
        this.tagOptions.forEach(o => {
            o.classList.remove('selected');
            if (entry.tags.includes(o.dataset.tag)) {
                o.classList.add('selected');
            }
        });
        this.updateSelectedTags();

        // Set text
        this.journalTextarea.value = entry.text;
        this.updateTextCounters();

        // Set date
        flatpickr("#entry-date", {
            dateFormat: "Y-m-d",
            defaultDate: entry.date
        });

        this.showToast('Entry loaded for editing', 'info');
    }

    showToast(message, type = 'info') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    // Calendar functionality
    renderCalendar() {
        if (!this.calendarGrid) return;

        const entries = this.getEntries();
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Update month display
        if (this.currentMonthEl) {
            this.currentMonthEl.textContent = new Date(year, month).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        }

        // Clear calendar
        const dayHeaders = document.querySelectorAll('.calendar-day-header');
        const dayCells = document.querySelectorAll('.calendar-day');
        
        // Remove existing day cells (keep headers)
        dayCells.forEach(cell => cell.remove());

        // Get first day of month and total days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Add empty cells for days before first day of month
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            this.calendarGrid.appendChild(emptyCell);
        }

        // Add cells for each day of month
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            // Check if there's an entry for this day
            const dayEntry = entries.find(entry => entry.date === dateStr);
            
            dayCell.innerHTML = `
                <div class="day-number">${day}</div>
                ${dayEntry ? `<div class="day-mood">${this.getMoodEmoji(dayEntry.mood)}</div>` : ''}
            `;
            
            if (dayEntry) {
                dayCell.classList.add('has-entry');
                dayCell.title = `Mood: ${dayEntry.mood}\nTags: ${dayEntry.tags.join(', ')}`;
                
                dayCell.addEventListener('click', () => {
                    this.loadEntryForEditing(dayEntry);
                    // Scroll to form if on same page
                    document.querySelector('.entry-form')?.scrollIntoView({ behavior: 'smooth' });
                });
            }
            
            this.calendarGrid.appendChild(dayCell);
        }
    }

    changeMonth(delta) {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + delta,
            1
        );
        this.renderCalendar();
    }
}

// Initialize the journal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const journal = new MoodJournal();
    
    // If on trends page, initialize charts
    if (window.location.pathname.includes('trends')) {
        journal.initializeCharts();
    }
});

// Add chart initialization method
MoodJournal.prototype.initializeCharts = function() {
    const entries = this.getEntries();
    
    if (entries.length === 0) return;
    
    // Mood frequency chart
    const moodCounts = {};
    const tagCounts = {};
    const monthlyMoods = {};
    
    entries.forEach(entry => {
        // Count moods
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        
        // Count tags
        entry.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        
        // Group by month
        const month = entry.date.substring(0, 7); // YYYY-MM
        if (!monthlyMoods[month]) {
            monthlyMoods[month] = {};
        }
        monthlyMoods[month][entry.mood] = (monthlyMoods[month][entry.mood] || 0) + 1;
    });
    
    // Mood Distribution Chart
    const moodCtx = document.getElementById('moodChart');
    if (moodCtx) {
        new Chart(moodCtx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(moodCounts).map(mood => mood.charAt(0).toUpperCase() + mood.slice(1)),
                datasets: [{
                    data: Object.values(moodCounts),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Mood Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        const months = Object.keys(monthlyMoods).sort();
        const moodTypes = Object.keys(moodCounts);
        
        const datasets = moodTypes.map((mood, index) => {
            const color = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
            ][index % 8];
            
            return {
                label: mood.charAt(0).toUpperCase() + mood.slice(1),
                data: months.map(month => monthlyMoods[month][mood] || 0),
                borderColor: color,
                backgroundColor: color + '20',
                tension: 0.4
            };
        });
        
        new Chart(trendCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: months.map(month => {
                    const [year, m] = month.split('-');
                    return new Date(year, m - 1).toLocaleDateString('en-US', { month: 'short' });
                }),
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    // Update stats
    const totalEntries = entries.length;
    const avgEntriesPerWeek = (totalEntries / (entries.length > 0 ? 
        Math.ceil((new Date() - new Date(entries[entries.length - 1].date)) / (1000 * 60 * 60 * 24 * 7)) : 1)).toFixed(1);
    const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    const totalTags = Object.keys(tagCounts).length;
    
    // Update stat cards if they exist
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-value').textContent = totalEntries;
        statCards[1].querySelector('.stat-value').textContent = avgEntriesPerWeek;
        statCards[2].querySelector('.stat-value').textContent = 
            mostCommonMood ? `${mostCommonMood[0].charAt(0).toUpperCase() + mostCommonMood[0].slice(1)}` : 'N/A';
        statCards[3].querySelector('.stat-value').textContent = totalTags;
    }
};