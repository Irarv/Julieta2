const audio = new Audio('musica.mp3');
audio.loop = true;

const matchstick = document.getElementById('matchstick');
const fireContainer = document.getElementById('fire-container');
const matchHead = document.getElementById('match-head');
const charredLayer = document.getElementById('charred-layer');
const instruction = document.getElementById('instruction');
const leftMessages = document.getElementById('left-messages');
const rightMessages = document.getElementById('right-messages');
const finalScreen = document.getElementById('final-screen');
const sparksContainer = document.getElementById('sparks-container');

let isDragging = false;
let startY = 0;
let currentY = 0;
let ignited = false;

const storyPhrases = [
    { side: 'left', text: "Sé que apenas nos estamos conociendo y que queremos ir paso a paso... 🕊️" },
    { side: 'right', text: "Pero desde que empezamos a hablar, me di cuenta de que eres alguien diferente. ✨" },
    { side: 'left', text: "Me encanta tu forma de ser y la seguridad que me transmites. 🪐" },
    { side: 'right', text: "No hay prisa, disfruto mucho cada momento y cada risa contigo, solo espero que sigamos conociéndonos más. 🤍" }
];

function dragStart(e) {
    if (ignited) return;
    isDragging = true;
    startY = e.clientY || e.touches[0].clientY;
    matchstick.style.transition = 'none';
}

function dragMove(e) {
    if (!isDragging || ignited) return;
    const clientY = e.clientY || e.touches[0].clientY;
    let deltaY = startY - clientY;

    if (deltaY > 0) {
        currentY = Math.min(deltaY, 80);
        matchstick.style.transform = `translateY(-${currentY}px)`;

        if (currentY > 50) {
            isDragging = false;
            igniteMatch();
        }
    }
}

function dragEnd() {
    if (ignited || !isDragging) return;
    isDragging = false;
    matchstick.style.transition = 'transform 0.4s ease';
    matchstick.style.transform = 'translateY(0px)';
}

matchstick.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);
matchstick.addEventListener('touchstart', dragStart, { passive: true });
window.addEventListener('touchmove', dragMove, { passive: true });
window.addEventListener('touchend', dragEnd);

function igniteMatch() {
    ignited = true;
    instruction.style.opacity = '0';
    audio.play().catch(err => console.log("Audio play blocked:", err));

    fireContainer.classList.add('active');
    matchHead.style.background = '#111';
    matchstick.style.transition = 'transform 0.4s ease';
    matchstick.style.transform = 'translateY(0px)';

    document.body.style.boxShadow = "inset 0 0 100px rgba(255, 130, 0, 0.3)";

    let burnDuration = 22000; 
    let startTime = Date.now();
    let totalHeight = matchstick.offsetHeight - 20;

    let burnInterval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let progress = elapsed / burnDuration;

        if (progress >= 1) {
            clearInterval(burnInterval);
            extinguishMatch();
        } else {
            let fireOffset = progress * totalHeight; 
            fireContainer.style.top = `calc(-55px + ${fireOffset}px)`;
            charredLayer.style.height = `${progress * 100}%`;
        }
    }, 50);

    storyPhrases.forEach((phrase, index) => {
        setTimeout(() => {
            displaySideMessage(phrase.side, phrase.text);
        }, index * 5500);
    });
}

function displaySideMessage(side, text) {
    const bubble = document.createElement('div');
    bubble.classList.add('text-bubble');
    const targetContainer = (side === 'left') ? leftMessages : rightMessages;
    targetContainer.appendChild(bubble);

    let charIndex = 0;
    function typeChar() {
        if (charIndex < text.length) {
            bubble.innerHTML += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 40);
        }
    }
    typeChar();
}

function extinguishMatch() {
    fireContainer.classList.remove('active');
    document.body.style.boxShadow = "none";

    setTimeout(() => {
        finalScreen.classList.add('show');
        launchFinalSparks();
    }, 1500);
}

function launchFinalSparks() {
    for (let i = 0; i < 20; i++) {
        const spark = document.createElement('div');
        spark.innerHTML = '✨';
        spark.style.position = 'absolute';
        spark.style.left = Math.random() * 100 + 'vw';
        spark.style.bottom = '-30px';
        spark.style.fontSize = (Math.random() * 12 + 8) + 'px';
        spark.style.opacity = Math.random() * 0.5 + 0.3;
        spark.style.animation = `floatUpSpark ${Math.random() * 3 + 4}s linear infinite`;
        sparksContainer.appendChild(spark);
    }
}

const style = document.createElement('style');
style.innerHTML = `
    @keyframes floatUpSpark {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
        100% { transform: translateY(-110vh) rotate(180deg); opacity: 0; }
    }
`;
document.head.appendChild(style);