<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mood Journal | Track Your Emotions</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-heart"></i> Mood Journal</h1>
            <p class="subtitle">Track your emotions, understand yourself better</p>
            <nav>
                <a href="index.jsp" class="nav-link active"><i class="fas fa-pen"></i> New Entry</a>
                <a href="calendar.jsp" class="nav-link"><i class="fas fa-calendar"></i> Calendar</a>
                <a href="trends.jsp" class="nav-link"><i class="fas fa-chart-line"></i> Trends</a>
            </nav>
        </header>

        <main>
            <div class="journal-container">
                <div class="entry-form">
                    <h2><i class="fas fa-plus-circle"></i> New Journal Entry</h2>
                    
                    <div class="date-selector">
                        <label for="entry-date"><i class="fas fa-calendar-day"></i> Date:</label>
                        <input type="text" id="entry-date" class="date-input" placeholder="Select date">
                    </div>

                    <div class="mood-selector">
                        <h3>How are you feeling today?</h3>
                        <div class="mood-options">
                            <div class="mood-option" data-mood="happy">
                                <div class="mood-emoji">😊</div>
                                <span>Happy</span>
                            </div>
                            <div class="mood-option" data-mood="excited">
                                <div class="mood-emoji">🤩</div>
                                <span>Excited</span>
                            </div>
                            <div class="mood-option" data-mood="calm">
                                <div class="mood-emoji">😌</div>
                                <span>Calm</span>
                            </div>
                            <div class="mood-option" data-mood="neutral">
                                <div class="mood-emoji">😐</div>
                                <span>Neutral</span>
                            </div>
                            <div class="mood-option" data-mood="sad">
                                <div class="mood-emoji">😔</div>
                                <span>Sad</span>
                            </div>
                            <div class="mood-option" data-mood="anxious">
                                <div class="mood-emoji">😰</div>
                                <span>Anxious</span>
                            </div>
                            <div class="mood-option" data-mood="angry">
                                <div class="mood-emoji">😠</div>
                                <span>Angry</span>
                            </div>
                            <div class="mood-option" data-mood="tired">
                                <div class="mood-emoji">😴</div>
                                <span>Tired</span>
                            </div>
                        </div>
                    </div>

                    <div class="mood-tags">
                        <h3>Add Tags</h3>
                        <div class="tags-container">
                            <div class="tag-option" data-tag="work">💼 Work</div>
                            <div class="tag-option" data-tag="family">👨‍👩‍👧‍👦 Family</div>
                            <div class="tag-option" data-tag="friends">👯 Friends</div>
                            <div class="tag-option" data-tag="health">💪 Health</div>
                            <div class="tag-option" data-tag="hobby">🎨 Hobby</div>
                            <div class="tag-option" data-tag="nature">🌳 Nature</div>
                            <div class="tag-option" data-tag="travel">✈️ Travel</div>
                            <div class="tag-option" data-tag="food">🍕 Food</div>
                        </div>
                        <div class="custom-tag">
                            <input type="text" id="custom-tag-input" placeholder="Add custom tag...">
                            <button id="add-tag-btn"><i class="fas fa-plus"></i> Add</button>
                        </div>
                        <div class="selected-tags" id="selected-tags"></div>
                    </div>

                    <div class="journal-text">
                        <h3><i class="fas fa-edit"></i> Write about your day</h3>
                        <textarea id="journal-textarea" placeholder="What made you feel this way? What happened today? Write freely..."></textarea>
                        <div class="text-info">
                            <span id="word-count">0 words</span>
                            <span id="char-count">0 characters</span>
                        </div>
                    </div>

                    <div class="entry-actions">
                        <button id="save-entry" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Entry
                        </button>
                        <button id="clear-entry" class="btn btn-secondary">
                            <i class="fas fa-trash"></i> Clear
                        </button>
                        <button id="view-entries" class="btn btn-secondary">
                            <i class="fas fa-history"></i> View Past Entries
                        </button>
                    </div>
                </div>

                <div class="recent-entries">
                    <h2><i class="fas fa-history"></i> Recent Entries</h2>
                    <div class="entries-list" id="entries-list">
                        <!-- Entries will be loaded here -->
                    </div>
                </div>
            </div>
        </main>

        <footer>
            <p>Your mood data is stored locally in your browser • Export option available</p>
        </footer>
    </div>

    <div id="toast" class="toast"></div>

    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/app.js"></script>
</body>
</html>