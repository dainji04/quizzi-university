let allQuestions = {};
let currentQuestions = [];
let shuffledQuestions = [];
let currentTopic = 'CNPM';

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

async function loadQuestionsData() {
    if (Object.keys(allQuestions).length === 0) {
        const res = await fetch('questions.json');
        allQuestions = await res.json();
    }
}

async function loadQuiz(topic) {
    document.getElementById('results').innerHTML = '';
    await loadQuestionsData();
    currentQuestions = allQuestions[topic] || [];
    document.getElementById('quiz-title').innerText = 'Trắc nghiệm ' + topic;
    shuffledQuestions = shuffle(currentQuestions).slice(0, 30);
    displayQuestions(shuffledQuestions);
}

function displayQuestions(qs) {
    const questionsDiv = document.getElementById('questions');
    questionsDiv.innerHTML = '';
    qs.forEach((q, index) => {
        const shuffledOptions = shuffle([...q.options]);
        const questionDiv = document.createElement('div');
        questionDiv.id = 'question-' + index;
        questionDiv.innerHTML = `
                    <p><strong>Câu ${index + 1}:</strong> ${q.question}</p>
                    ${shuffledOptions
                        .map(
                            (opt) => `
                        <label class="option-label">
                            <input type="radio" name="question${index}" value="${opt}">
                            ${opt}
                        </label>
                    `
                        )
                        .join('')}
                `;
        questionsDiv.appendChild(questionDiv);
    });

    // Highlight đã chọn
    qs.forEach((q, idx) => {
        const radios = document.getElementsByName('question' + idx);
        radios.forEach((radio) => {
            radio.addEventListener('change', () => {
                radios.forEach((r) =>
                    r.parentElement.classList.remove('selected')
                );
                if (radio.checked) {
                    radio.parentElement.classList.add('selected');
                }
                updateSidebarAnswered();
            });
        });
    });

    displaySidebar(qs);
    updateSidebarAnswered();
}

function displaySidebar(qs) {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';
    for (let i = 0; i < qs.length; i++) {
        const btn = document.createElement('button');
        btn.className = 'sidebar-btn';
        btn.innerText = i + 1;
        btn.onclick = () => {
            document
                .getElementById('question-' + i)
                .scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        sidebar.appendChild(btn);
    }
    // const submitBtn = document.createElement('button');
    // submitBtn.id = 'sidebar-submit-btn';
    // submitBtn.innerText = 'Nộp bài';
    // submitBtn.className = 'sidebar-submit-btn';
    // submitBtn.onclick = () => {
    //     document.getElementById('submit').click();
    // };
    sidebar.innerHTML += `<button id="submit" style="grid-column: span 3;">Nộp bài</button>`;
}

function updateSidebarAnswered() {
    shuffledQuestions.forEach((q, idx) => {
        const radios = document.getElementsByName('question' + idx);
        let answered = false;
        for (const r of radios) {
            if (r.checked) {
                answered = true;
                break;
            }
        }
        const sidebarBtn = document.getElementsByClassName('sidebar-btn')[idx];
        if (sidebarBtn) {
            if (answered) {
                sidebarBtn.classList.add('answered');
            } else {
                sidebarBtn.classList.remove('answered');
            }
        }
    });
}

document.getElementById('submit').onclick = function () {
    let score = 0;
    let resultsHtml = '';
    shuffledQuestions.forEach((q, idx) => {
        const radios = document.getElementsByName('question' + idx);
        let selected = '';
        for (const r of radios) {
            if (r.checked) {
                selected = r.value;
                break;
            }
        }
        if (selected === q.correctAnswer) {
            score++;
            resultsHtml += `<p style="color:green">Câu ${idx + 1}: Đúng</p>`;
        } else {
            resultsHtml += `<p style="color:red">Câu ${
                idx + 1
            }: Sai. Đáp án đúng: <b>${q.correctAnswer}</b></p>`;
        }
    });
    document.getElementById('results').innerHTML =
        `<h2>Kết quả: ${score} / ${shuffledQuestions.length}</h2>` +
        resultsHtml;
    window.scrollTo(0, document.body.scrollHeight);
};

document.getElementById('btn-cnpm').onclick = function () {
    setActiveBtn('btn-cnpm');
    currentTopic = 'CNPM';
    localStorage.setItem('selectedTopic', 'CNPM');
    loadQuiz('CNPM');
};
document.getElementById('btn-tester').onclick = function () {
    setActiveBtn('btn-tester');
    currentTopic = 'Tester';
    localStorage.setItem('selectedTopic', 'Tester');
    loadQuiz('Tester');
};
document.getElementById('btn-web').onclick = function () {
    setActiveBtn('btn-web');
    currentTopic = 'Web';
    localStorage.setItem('selectedTopic', 'Web');
    loadQuiz('Web');
};

function setActiveBtn(btnId) {
    document
        .querySelectorAll('.header-btn')
        .forEach((btn) => btn.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
}

window.onload = function () {
    loadQuiz('CNPM');
};

window.onload = function () {
    const savedTopic = localStorage.getItem('selectedTopic') || 'CNPM';
    currentTopic = savedTopic;
    setActiveBtn(
        savedTopic === 'CNPM'
            ? 'btn-cnpm'
            : savedTopic === 'Tester'
            ? 'btn-tester'
            : 'btn-web'
    );
    loadQuiz(savedTopic);
};

document.getElementById('btn-get-docs').onclick = function () {
    const url = `https://drive.google.com/drive/folders/1YMY2b4kwdHpnP6gBNi-FSjzqq7brAZey?usp=sharing`;
    window.open(url, '_blank');
};

// Create "To Top" button
const toTopBtn = document.createElement('button');
toTopBtn.id = 'to-top-btn';
toTopBtn.innerText = '↑ Top';
toTopBtn.style.position = 'fixed';
toTopBtn.style.bottom = '30px';
toTopBtn.style.right = '30px';
toTopBtn.style.display = 'none';
toTopBtn.style.zIndex = '1000';
toTopBtn.style.padding = '10px 16px';
toTopBtn.style.fontSize = '18px';
toTopBtn.style.borderRadius = '6px';
toTopBtn.style.border = 'none';
toTopBtn.style.background = '#007bff';
toTopBtn.style.color = '#fff';
toTopBtn.style.cursor = 'pointer';
toTopBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
document.body.appendChild(toTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        toTopBtn.style.display = 'block';
    } else {
        toTopBtn.style.display = 'none';
    }
});

toTopBtn.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
