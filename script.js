localStorage.removeItem('theme');

// ===== Typewriter Effect (Homepage) =====
const typewriterElement = document.getElementById('typewriterText');
if (typewriterElement) {
    const text = 'Ethical Hacking';
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 80);
        }
    }
    
    typeWriter();
}

// ===== Command Explorer (CLI Page) =====
const commandSelect = document.getElementById('commandSelect');
const commandExplanation = document.getElementById('commandExplanation');

if (commandSelect && commandExplanation) {
    const explanations = {
        'ls': 'Lists files and directories in the current folder. The most basic navigation command—shows you what\'s here.',
        'ls -la': 'Lists all files (including hidden ones) with detailed information. The -l flag shows permissions, owner, size, and modification time. The -a flag reveals files that start with a dot (hidden files).',
        'cd /var/log': 'Changes the current working directory to /var/log. This is where most Linux systems store log files—essential for security auditing.',
        'cat /etc/passwd': 'Displays the contents of the /etc/passwd file. This file contains user account information. While passwords are stored elsewhere (in /etc/shadow), the passwd file tells you what users exist on the system.',
        'grep -r \'password\' .': 'Recursively searches through all files in the current directory and subdirectories for the word "password". Useful for finding credentials accidentally left in configuration files or source code.',
        'ps aux': 'Shows all running processes on the system with detailed information. The "a" shows processes from all users, "u" shows the user/owner, and "x" shows processes not attached to a terminal.'
    };
    
    commandSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        commandExplanation.textContent = explanations[selected] || 'Select a command to see its explanation.';
    });
}

// ===== Nmap Flag Builder (Nmap Page) =====
const flagCheckboxes = document.querySelectorAll('.flag-checkbox');
const generatedFlagsSpan = document.getElementById('generatedFlags');
const flagExplanationDiv = document.getElementById('flagExplanation');

if (flagCheckboxes.length > 0 && generatedFlagsSpan && flagExplanationDiv) {
    const flagExplanations = {
        '-sS': 'SYN scan - the default and stealthy option. Sends SYN packets and analyzes responses without completing full TCP connections. Less likely to be logged by the target.',
        '-sV': 'Probes open ports to determine service and version information. Essential for identifying what software is actually running and whether it has known vulnerabilities.',
        '-p 1-1000': 'Scans only the specified port range instead of the default 1000 most common ports. Useful when you want to focus on specific services or do a full port scan (-p-).',
        '-A': 'Aggressive scan - enables OS detection, version detection, script scanning, and traceroute. Very thorough but also very noisy and detectable.'
    };
    
    function updateNmapCommand() {
        const selectedFlags = [];
        let explanation = '';
        
        flagCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFlags.push(checkbox.value);
                explanation += `<strong>${checkbox.value}:</strong> ${flagExplanations[checkbox.value]}<br><br>`;
            }
        });
        
        const flagsString = selectedFlags.length > 0 ? selectedFlags.join(' ') : '(no flags selected)';
        generatedFlagsSpan.textContent = flagsString + (selectedFlags.length > 0 ? ' ' : '') + '192.168.1.0/24';
        
        if (selectedFlags.length === 0) {
            flagExplanationDiv.innerHTML = 'Select flags to see what they do. No flags runs a basic TCP SYN scan of the 1000 most common ports.';
        } else {
            flagExplanationDiv.innerHTML = explanation;
        }
    }
    
    flagCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateNmapCommand);
    });
    
    // Initialize
    updateNmapCommand();
}

// ===== SSH Quiz =====
const quizOptions = document.querySelectorAll('.quiz-option');
const quizFeedback = document.getElementById('quizFeedback');

if (quizOptions.length > 0 && quizFeedback) {
    let answered = false;
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (answered) return;
            
            const isCorrect = this.dataset.correct === 'true';
            
            quizOptions.forEach(opt => {
                opt.disabled = true;
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });
            
            if (!isCorrect) {
                this.classList.add('incorrect');
            }
            
            if (isCorrect) {
                quizFeedback.textContent = '✓ Correct! SSH encrypts all traffic, preventing eavesdropping and credential theft.';
                quizFeedback.classList.add('correct');
            } else {
                quizFeedback.textContent = '✗ Not quite. The defining feature of SSH is encryption—Telnet sent everything in plain text, including passwords.';
                quizFeedback.classList.add('incorrect');
            }
            
            answered = true;
        });
    });
}

// ===== Hydra Command Builder =====
const hydraProtocol = document.getElementById('hydraProtocol');
const hydraUserSource = document.getElementById('hydraUserSource');
const hydraCommandSpan = document.getElementById('hydraCommand');
const hydraExplanationDiv = document.getElementById('hydraExplanation');

if (hydraProtocol && hydraUserSource && hydraCommandSpan && hydraExplanationDiv) {
    function updateHydraCommand() {
        const protocol = hydraProtocol.value;
        const userSource = hydraUserSource.value;
        
        let command = 'hydra ';
        let explanation = '';
        
        if (userSource === 'single') {
            command += '-l admin ';
            explanation = 'Testing a single username ("admin") ';
        } else {
            command += '-L users.txt ';
            explanation = 'Testing a list of usernames from users.txt ';
        }
        
        command += '-P wordlist.txt ';
        explanation += 'against a wordlist of passwords ';
        
        command += `${protocol}://target`;
        
        if (protocol === 'ssh') {
            explanation += 'using the SSH protocol on port 22.';
        } else if (protocol === 'ftp') {
            explanation += 'using the FTP protocol on port 21.';
        } else {
            explanation += 'using an HTTP POST form submission.';
        }
        
        hydraCommandSpan.textContent = command;
        hydraExplanationDiv.textContent = explanation;
    }
    
    hydraProtocol.addEventListener('change', updateHydraCommand);
    hydraUserSource.addEventListener('change', updateHydraCommand);
    
    // Initialize
    updateHydraCommand();
}

// ===== Password Strength Simulator (Brute-Force Page) =====
const passwordInput = document.getElementById('passwordInput');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

if (passwordInput && strengthFill && strengthText) {
    passwordInput.addEventListener('input', function(e) {
        const password = e.target.value;
        let strength = 0;
        let crackTime = '';
        
        if (password.length === 0) {
            strengthFill.style.width = '0%';
            strengthText.textContent = 'Enter a password to see estimated crack time';
            return;
        }
        
        // Calculate character set size
        let charsetSize = 0;
        if (/[a-z]/.test(password)) charsetSize += 26;
        if (/[A-Z]/.test(password)) charsetSize += 26;
        if (/[0-9]/.test(password)) charsetSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
        
        const combinations = Math.pow(charsetSize, password.length);
        const guessesPerSecond = 1000000000; // 1 billion guesses per second
        
        let seconds = combinations / guessesPerSecond;
        
        if (seconds < 1) {
            crackTime = 'instantly';
            strength = 0;
        } else if (seconds < 60) {
            crackTime = Math.round(seconds) + ' seconds';
            strength = 5;
        } else if (seconds < 3600) {
            crackTime = Math.round(seconds / 60) + ' minutes';
            strength = 10;
        } else if (seconds < 86400) {
            crackTime = Math.round(seconds / 3600) + ' hours';
            strength = 15;
        } else if (seconds < 31536000) {
            crackTime = Math.round(seconds / 86400) + ' days';
            strength = 25;
        } else if (seconds < 3153600000) {
            crackTime = Math.round(seconds / 31536000) + ' years';
            strength = 40;
        } else if (seconds < 3.1536e13) {
            crackTime = (seconds / 31536000).toExponential(1) + ' years';
            strength = 60;
        } else if (seconds < 1e18) {
            crackTime = 'millions of years';
            strength = 80;
        } else {
            crackTime = 'billions of years';
            strength = 100;
        }
        
        // Additional penalties for common patterns
        const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'welcome', 'letmein'];
        commonPatterns.forEach(pattern => {
            if (password.toLowerCase().includes(pattern)) {
                strength = Math.max(0, strength - 30);
            }
        });
        
        if (password.length < 8) {
            strength = Math.max(0, strength - 20);
        }
        
        strength = Math.min(100, Math.max(0, strength));
        strengthFill.style.width = strength + '%';
        
        if (strength < 20) {
            strengthText.textContent = `⚠ Very weak - cracked ${crackTime} with an offline brute-force attack`;
        } else if (strength < 40) {
            strengthText.textContent = `⚠ Weak - cracked in ~${crackTime}`;
        } else if (strength < 60) {
            strengthText.textContent = `Moderate - cracked in ~${crackTime}`;
        } else if (strength < 80) {
            strengthText.textContent = `✓ Strong - cracked in ~${crackTime}`;
        } else {
            strengthText.textContent = `✓✓ Very strong - cracked in ~${crackTime}`;
        }
    });
}

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Add Active State to Current Page in Navigation =====
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
        if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        }
    }
});

// ===== Console Welcome Message =====
console.log('%c[ETHICAL HACKING KNOWLEDGE REPOSITORY]', 'color: #00d4aa; font-weight: bold; font-size: 14px;');
console.log('%cThis site was built as a portfolio project from personal lab experience.', 'color: #a6b1c2; font-style: italic;');
console.log('%cAll content is original—written from my own understanding of the tools and concepts.', 'color: #5e9cff;');
