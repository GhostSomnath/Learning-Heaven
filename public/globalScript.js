// Function to prevent specific key combinations
function preventShortcuts(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
        alert(`Action disabled: ${e.key === 'c' ? 'Copy (Ctrl+C)' : 'Paste (Ctrl+V)'}`);
    }
}

// Add event listeners for keydown events
document.addEventListener('keydown', preventShortcuts);

// Function to prevent copy, cut, and paste actions
function preventClipboardActions(e) {
    e.preventDefault();
    alert('This action is disabled on this page.');
}

// Add event listeners for copy, cut, and paste events
document.addEventListener('copy', preventClipboardActions);
document.addEventListener('cut', preventClipboardActions);
document.addEventListener('paste', preventClipboardActions);

// Prevent right-click context menu
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    // alert('Right-click is disabled on this page.');
});

// Function to detect if the developer tools are open
function isDevToolsOpen() {
    const threshold = 160; // Change this value to adjust the threshold
    const devtools = window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold;
    return devtools;
}

// Function to display alternative content
function displayAlternativeContent() {
    const content = '<div><p>Hello World</p></div>';
    document.body.innerHTML = content;
}

// Monitor for developer tools and display alternative content if open
setInterval(function () {
    if (isDevToolsOpen()) {
        displayAlternativeContent();
    }
}, 1000);






//  DARk TOGGLE THEME 

// Function to toggle dark theme and change logo

// Function to toggle dark theme and change logo
function showTheme() {
    const body = document.body;
    body.classList.toggle('dark');

    // Toggle dark theme on other elements with class 'darkable'
    const elementsToToggle = document.querySelectorAll('.darkable');
    elementsToToggle.forEach(function (element) {
        element.classList.toggle('dark');
    });

    // Change navbar logo based on the theme
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        if (body.classList.contains('dark')) {
            navLogo.src = '../Images/DarkNav.png';
        } else {
            navLogo.src = '../Images/logo4-removebg-preview.png';
        }
    }

    const footerLogo = document.getElementById('footerlogo');
    if (footerLogo) {
        if (body.classList.contains('dark')) {
            footerLogo.src = '../Images/darkshortlogo.png';
        } else {
            footerLogo.src = '../Images/logo3-removebg-preview.png';
        }
    }

    // Change the theme icon
    const themeIcon = document.getElementById('theme-icon');
    if (body.classList.contains('dark')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}
