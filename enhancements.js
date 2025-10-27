// Enhanced JavaScript for Instructional Coaching Module
// Additional features and improvements

// Module completion tracking with localStorage
class ModuleTracker {
    constructor() {
        this.storageKey = 'coaching-module-progress';
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        this.progress = saved ? JSON.parse(saved) : {
            completedModules: [],
            quizScores: {},
            lastAccessed: null,
            totalTime: 0,
            startTime: Date.now()
        };
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    markModuleComplete(moduleId) {
        if (!this.progress.completedModules.includes(moduleId)) {
            this.progress.completedModules.push(moduleId);
            this.progress.lastAccessed = Date.now();
            this.saveProgress();
        }
    }

    saveQuizScore(quizId, score) {
        this.progress.quizScores[quizId] = {
            score: score,
            timestamp: Date.now()
        };
        this.saveProgress();
    }

    getTotalTime() {
        const currentSession = Date.now() - this.progress.startTime;
        return this.progress.totalTime + currentSession;
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.loadProgress();
            location.reload();
        }
    }
}

// Initialize tracker
const tracker = new ModuleTracker();

// Enhanced navigation with keyboard support
class NavigationEnhancer {
    constructor() {
        this.modules = Array.from(document.querySelectorAll('.module'));
        this.currentIndex = 0;
        this.setupKeyboardNavigation();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) return;
            
            switch(e.key) {
                case 'ArrowRight':
                    this.nextModule();
                    break;
                case 'ArrowLeft':
                    this.previousModule();
                    break;
                case 'Home':
                    this.showModuleByIndex(0);
                    break;
                case 'End':
                    this.showModuleByIndex(this.modules.length - 1);
                    break;
            }
        });
    }

    nextModule() {
        if (this.currentIndex < this.modules.length - 1) {
            this.showModuleByIndex(this.currentIndex + 1);
        }
    }

    previousModule() {
        if (this.currentIndex > 0) {
            this.showModuleByIndex(this.currentIndex - 1);
        }
    }

    showModuleByIndex(index) {
        this.modules.forEach(m => m.classList.remove('active'));
        this.modules[index].classList.add('active');
        this.currentIndex = index;
        
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        navLinks[index].classList.add('active');
        
        // Track completion
        tracker.markModuleComplete(this.modules[index].id);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Interactive elements enhancement
class InteractiveElements {
    constructor() {
        this.setupTooltips();
        this.setupProgressAnimations();
        this.setupActivityTracking();
    }

    setupTooltips() {
        const elements = document.querySelectorAll('[data-tooltip]');
        elements.forEach(el => {
            el.classList.add('tooltip');
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltiptext';
            tooltip.textContent = el.getAttribute('data-tooltip');
            el.appendChild(tooltip);
        });
    }

    setupProgressAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress');
                    if (progressBar) {
                        const targetWidth = progressBar.getAttribute('data-target') || '0%';
                        setTimeout(() => {
                            progressBar.style.width = targetWidth;
                        }, 300);
                    }
                }
            });
        });

        document.querySelectorAll('.progress-bar').forEach(bar => {
            observer.observe(bar);
        });
    }

    setupActivityTracking() {
        const activities = document.querySelectorAll('.activity');
        activities.forEach((activity, index) => {
            const activityId = `activity-${index}`;
            activity.setAttribute('data-activity-id', activityId);
            
            // Add completion checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = activityId;
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    activity.classList.add('completed');
                } else {
                    activity.classList.remove('completed');
                }
            });
            
            const label = document.createElement('label');
            label.htmlFor = activityId;
            label.textContent = ' Mark as completed';
            label.style.marginTop = '1rem';
            label.style.display = 'block';
            
            activity.appendChild(checkbox);
            activity.appendChild(label);
        });
    }
}

// Enhanced quiz functionality
class QuizEnhancer {
    constructor() {
        this.setupQuizzes();
    }

    setupQuizzes() {
        const quizzes = document.querySelectorAll('.quiz');
        quizzes.forEach((quiz, index) => {
            const quizId = `quiz-${index}`;
            quiz.setAttribute('data-quiz-id', quizId);
            
            // Add timer functionality
            const timerDiv = document.createElement('div');
            timerDiv.className = 'quiz-timer';
            timerDiv.innerHTML = '<span>Time: </span><span id="timer-' + quizId + '">00:00</span>';
            quiz.insertBefore(timerDiv, quiz.firstChild);
            
            // Start timer when quiz is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.startTimer(quizId);
                    }
                });
            });
            observer.observe(quiz);
        });
    }

    startTimer(quizId) {
        let seconds = 0;
        const timerElement = document.getElementById('timer-' + quizId);
        
        setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

// Resource downloader with tracking
class ResourceDownloader {
    constructor() {
        this.downloadCount = {};
        this.setupDownloadTracking();
    }

    setupDownloadTracking() {
        const buttons = document.querySelectorAll('[onclick*="downloadTemplate"]');
        buttons.forEach(button => {
            const match = button.getAttribute('onclick').match(/downloadTemplate\('(.+?)'\)/);
            if (match) {
                const resourceName = match[1];
                button.addEventListener('click', () => {
                    this.trackDownload(resourceName);
                });
            }
        });
    }

    trackDownload(resourceName) {
        this.downloadCount[resourceName] = (this.downloadCount[resourceName] || 0) + 1;
        console.log(`Resource "${resourceName}" downloaded ${this.downloadCount[resourceName]} times`);
        
        // Create actual download in real implementation
        this.createDownload(resourceName);
    }

    createDownload(resourceName) {
        // This is where you would generate actual files
        const content = this.generateResourceContent(resourceName);
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resourceName}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateResourceContent(resourceName) {
        // Generate template content based on resource type
        const templates = {
            'context-map': this.generateContextMapTemplate(),
            'literacy-carousel': this.generateLiteracyCarouselTemplate(),
            'cultural-asset-map': this.generateCulturalAssetTemplate(),
            'observation-form': this.generateObservationFormTemplate(),
            'coaching-log': this.generateCoachingLogTemplate()
        };
        
        return templates[resourceName] || '<h1>Template Coming Soon</h1>';
    }

    generateContextMapTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>School Context Mapping Template</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; }
        textarea { width: 100%; min-height: 100px; }
    </style>
</head>
<body>
    <h1>School Context Mapping Template</h1>
    
    <div class="section">
        <h2>School Demographics</h2>
        <p>Total Students: <input type="number" placeholder="500"></p>
        <p>Demographic Breakdown:</p>
        <textarea placeholder="82% African American, etc."></textarea>
    </div>
    
    <div class="section">
        <h2>Teacher Analysis</h2>
        <p>Total Teachers: <input type="number" placeholder="24"></p>
        <p>On Improvement Plans: <input type="number" placeholder="16"></p>
        <p>Strengths:</p>
        <textarea placeholder="List teacher strengths..."></textarea>
        <p>Areas for Growth:</p>
        <textarea placeholder="List areas needing development..."></textarea>
    </div>
    
    <div class="section">
        <h2>Community Assets</h2>
        <textarea placeholder="List community resources, partnerships, cultural assets..."></textarea>
    </div>
    
    <div class="section">
        <h2>Challenges & Opportunities</h2>
        <textarea placeholder="Identify key challenges and potential opportunities..."></textarea>
    </div>
    
    <button onclick="window.print()">Print Context Map</button>
</body>
</html>`;
    }

    generateLiteracyCarouselTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Literacy Carousel Station Materials</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .station { page-break-after: always; padding: 20px; border: 2px solid #3498db; margin: 20px 0; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; }
        .materials { background: #f0f0f0; padding: 15px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Literacy Concept Carousel Stations</h1>
    
    <div class="station">
        <h2>Station 1: Phoneme-Grapheme Mapping</h2>
        <div class="materials">
            <h3>Materials Needed:</h3>
            <ul>
                <li>Phoneme cards</li>
                <li>Grapheme tiles</li>
                <li>Word lists for practice</li>
                <li>Mapping charts</li>
            </ul>
        </div>
        <h3>Activities:</h3>
        <ol>
            <li>Match phonemes to graphemes</li>
            <li>Build words using tiles</li>
            <li>Identify irregular patterns</li>
        </ol>
    </div>
    
    <div class="station">
        <h2>Station 2: Morphology in Action</h2>
        <div class="materials">
            <h3>Materials Needed:</h3>
            <ul>
                <li>Root word cards</li>
                <li>Prefix/suffix cards</li>
                <li>Word building mats</li>
                <li>Meaning charts</li>
            </ul>
        </div>
        <h3>Activities:</h3>
        <ol>
            <li>Build words with morphemes</li>
            <li>Analyze word meanings</li>
            <li>Create morpheme trees</li>
        </ol>
    </div>
    
    <!-- Additional stations would continue here -->
    
</body>
</html>`;
    }

    generateCulturalAssetTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Cultural Asset Mapping Guide</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .asset-category { margin: 20px 0; padding: 15px; background: #e8f5e9; border-radius: 8px; }
        h1 { color: #2c3e50; }
        h2 { color: #27ae60; }
    </style>
</head>
<body>
    <h1>Cultural Asset Mapping Guide</h1>
    
    <div class="asset-category">
        <h2>Language Practices</h2>
        <p>Document the linguistic resources in your classroom:</p>
        <ul>
            <li>Home languages spoken: <input type="text" style="width: 300px;"></li>
            <li>Dialects and variations: <input type="text" style="width: 300px;"></li>
            <li>Bilingual/multilingual students: <input type="text" style="width: 300px;"></li>
        </ul>
    </div>
    
    <div class="asset-category">
        <h2>Family & Community Knowledge</h2>
        <p>Identify expertise and skills in families:</p>
        <textarea style="width: 100%; height: 100px;" placeholder="List family professions, skills, cultural knowledge..."></textarea>
    </div>
    
    <div class="asset-category">
        <h2>Cultural Traditions</h2>
        <p>Document celebrations, practices, and values:</p>
        <textarea style="width: 100%; height: 100px;" placeholder="List cultural celebrations, traditions, important values..."></textarea>
    </div>
    
    <button onclick="window.print()">Print Asset Map</button>
</body>
</html>`;
    }

    generateObservationFormTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Classroom Observation Form</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .form-section { margin: 15px 0; padding: 15px; border: 1px solid #ddd; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #3498db; color: white; }
    </style>
</head>
<body>
    <h1>Non-Evaluative Classroom Observation Form</h1>
    
    <div class="form-section">
        <h2>Basic Information</h2>
        <p>Teacher: <input type="text" style="width: 200px;"> Date: <input type="date"></p>
        <p>Grade/Subject: <input type="text" style="width: 200px;"> Time: <input type="time"></p>
    </div>
    
    <div class="form-section">
        <h2>Questioning Techniques Observed</h2>
        <table>
            <tr>
                <th>DOK Level</th>
                <th>Tally</th>
                <th>Examples</th>
            </tr>
            <tr>
                <td>Level 1 (Recall)</td>
                <td><input type="text" style="width: 50px;"></td>
                <td><input type="text" style="width: 300px;"></td>
            </tr>
            <tr>
                <td>Level 2 (Skill/Concept)</td>
                <td><input type="text" style="width: 50px;"></td>
                <td><input type="text" style="width: 300px;"></td>
            </tr>
            <tr>
                <td>Level 3 (Strategic)</td>
                <td><input type="text" style="width: 50px;"></td>
                <td><input type="text" style="width: 300px;"></td>
            </tr>
            <tr>
                <td>Level 4 (Extended)</td>
                <td><input type="text" style="width: 50px;"></td>
                <td><input type="text" style="width: 300px;"></td>
            </tr>
        </table>
    </div>
    
    <div class="form-section">
        <h2>Student Engagement</h2>
        <textarea style="width: 100%; height: 100px;" placeholder="Describe student engagement levels and participation..."></textarea>
    </div>
    
</body>
</html>`;
    }

    generateCoachingLogTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Instructional Coaching Log</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .log-entry { margin: 20px 0; padding: 15px; border: 1px solid #3498db; border-radius: 8px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; }
        .goals { background: #e3f2fd; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Instructional Coaching Log</h1>
    
    <div class="log-entry">
        <h2>Coaching Session Details</h2>
        <p>Teacher: <input type="text"> Date: <input type="date"> Duration: <input type="text" style="width: 100px;"></p>
        <p>Type: 
            <select>
                <option>Pre-Conference</option>
                <option>Observation</option>
                <option>Post-Conference</option>
                <option>Check-in</option>
                <option>Professional Development</option>
            </select>
        </p>
    </div>
    
    <div class="log-entry">
        <h2>Focus Area</h2>
        <div class="goals">
            <p>Current Goal:</p>
            <textarea style="width: 100%; height: 60px;"></textarea>
        </div>
    </div>
    
    <div class="log-entry">
        <h2>Discussion Notes</h2>
        <textarea style="width: 100%; height: 150px;" placeholder="Key points discussed..."></textarea>
    </div>
    
    <div class="log-entry">
        <h2>Next Steps</h2>
        <textarea style="width: 100%; height: 100px;" placeholder="Action items and follow-up..."></textarea>
    </div>
    
</body>
</html>`;
    }
}

// Certificate generator
class CertificateGenerator {
    generateCertificate(name) {
        const completedModules = tracker.progress.completedModules.length;
        const totalTime = Math.round(tracker.getTotalTime() / 1000 / 60); // minutes
        const date = new Date().toLocaleDateString();
        
        const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Certificate of Completion</title>
    <style>
        body {
            font-family: Georgia, serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .certificate {
            background: white;
            padding: 60px;
            border: 10px solid #2c3e50;
            box-shadow: 0 0 50px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
        }
        h1 {
            color: #2c3e50;
            font-size: 48px;
            margin-bottom: 20px;
        }
        h2 {
            color: #3498db;
            font-size: 32px;
            margin: 30px 0;
        }
        .recipient {
            font-size: 36px;
            color: #2c3e50;
            margin: 40px 0;
            font-weight: bold;
        }
        .details {
            font-size: 18px;
            line-height: 1.8;
            margin: 30px 0;
        }
        .signature-line {
            border-bottom: 2px solid #333;
            width: 300px;
            margin: 50px auto 10px;
        }
        .date {
            margin-top: 40px;
            font-size: 16px;
        }
        @media print {
            body { background: white; }
            .certificate { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <h1>Certificate of Completion</h1>
        <p class="details">This certifies that</p>
        <p class="recipient">${name}</p>
        <p class="details">has successfully completed the</p>
        <h2>Instructional Coaching for Merged Schools</h2>
        <p class="details">
            E-Learning Training Module<br>
            Focused on Literacy Development & Pedagogical Excellence<br>
            <br>
            Modules Completed: ${completedModules}<br>
            Total Training Time: ${totalTime} minutes
        </p>
        <div class="signature-line"></div>
        <p>Instructional Leadership Department</p>
        <p class="date">Date: ${date}</p>
    </div>
</body>
</html>`;
        
        const blob = new Blob([certificateHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coaching-certificate-${name.replace(/\s+/g, '-').toLowerCase()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    const navigation = new NavigationEnhancer();
    const interactive = new InteractiveElements();
    const quizzes = new QuizEnhancer();
    const resources = new ResourceDownloader();
    const certificates = new CertificateGenerator();
    
    // Override the existing functions with enhanced versions
    window.downloadTemplate = function(templateName) {
        resources.trackDownload(templateName);
    };
    
    window.generateCertificate = function() {
        const name = prompt('Please enter your name for the certificate:');
        if (name) {
            certificates.generateCertificate(name);
        }
    };
    
    // Add progress reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Progress';
    resetButton.className = 'button';
    resetButton.style.position = 'fixed';
    resetButton.style.bottom = '20px';
    resetButton.style.right = '20px';
    resetButton.style.fontSize = '0.875rem';
    resetButton.onclick = () => tracker.resetProgress();
    document.body.appendChild(resetButton);
    
    // Show welcome message for returning users
    if (tracker.progress.lastAccessed) {
        const lastDate = new Date(tracker.progress.lastAccessed);
        console.log(`Welcome back! You last accessed this module on ${lastDate.toLocaleDateString()}`);
    }
});

// Add smooth scrolling for all anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Print-friendly version
window.addEventListener('beforeprint', function() {
    // Show all modules for printing
    document.querySelectorAll('.module').forEach(module => {
        module.style.display = 'block';
    });
});

window.addEventListener('afterprint', function() {
    // Restore normal view after printing
    document.querySelectorAll('.module').forEach(module => {
        module.style.display = '';
    });
    document.querySelector('.module.active').style.display = 'block';
});