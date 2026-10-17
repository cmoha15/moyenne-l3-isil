
function showSemester(semester) {
    
    document.getElementById('section-s5').classList.remove('active');
    document.getElementById('section-s6').classList.remove('active');
    
   
    document.getElementById('btn-s5').classList.remove('active');
    document.getElementById('btn-s6').classList.remove('active');
    
    document.getElementById(`section-${semester}`).classList.add('active');
    document.getElementById(`btn-${semester}`).classList.add('active');
}

function getVal(id) {
    const el = document.getElementById(id);
    if (!el || el.value === "") return null;
    const num = parseFloat(el.value);
    if (num < 0 || num > 20) {
        throw new Error("Erreur : Toutes les notes doivent être comprises entre 0 et 20.");
    }
    return num;
}

function calculateModuleScore(ex, td, tp, hasTD, hasTP) {
    if (hasTD && hasTP) {
        if (ex === null && td === null && tp === null) return null;
        return ( (ex || 0) * 0.6 ) + ( ( ((td || 0) + (tp || 0)) / 2 ) * 0.4 );
    } else if (hasTD && !hasTP) {
        if (ex === null && td === null) return null;
        return ( (ex || 0) * 0.6 ) + ( (td || 0) * 0.4 );
    } else if (!hasTD && hasTP) {
        if (ex === null && tp === null) return null;
        return ( (ex || 0) * 0.6 ) + ( (tp || 0) * 0.4 );
    } else {
        return ex;
    }
}

function updateModule(semester, moduleIndex, hasTD, hasTP) {
    try {
        let ex = null, td = null, tp = null, note = null;
        let scoreEl = document.getElementById(`${semester}-m${moduleIndex}-score`);

        if ((semester === 's5' && moduleIndex === 7) || (semester === 's6' && moduleIndex === 4)) {
            let inputId = semester === 's5' ? "s5-m7-note" : "s6-m4-note";
            note = getVal(inputId);
            if (note !== null) {
                scoreEl.textContent = note.toFixed(2);
                scoreEl.style.color = note >= 10 ? "var(--success)" : "var(--danger)";
            } else {
                scoreEl.textContent = "--";
                scoreEl.style.color = "var(--text-main)";
            }
            return;
        }

        ex = getVal(`${semester}-m${moduleIndex}-ex`);
        if (hasTD) td = getVal(`${semester}-m${moduleIndex}-td`);
        if (hasTP) tp = getVal(`${semester}-m${moduleIndex}-tp`);

        const moduleScore = calculateModuleScore(ex, td, tp, hasTD, hasTP);
        if (moduleScore !== null) {
            scoreEl.textContent = moduleScore.toFixed(2);
            scoreEl.style.color = moduleScore >= 10 ? "var(--success)" : "var(--danger)";
        } else {
            scoreEl.textContent = "--";
            scoreEl.style.color = "var(--text-main)";
        }
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // S5
    setupListener('s5', 1, true, true);
    setupListener('s5', 2, true, true);
    setupListener('s5', 3, true, true);
    setupListener('s5', 4, true, false);
    setupListener('s5', 5, true, true);
    setupListener('s5', 6, true, true);
    setupListener('s5', 7, false, false);

    // S6
    setupListener('s6', 1, false, true);
    setupListener('s6', 2, true, true);
    setupListener('s6', 3, false, true);
    setupListener('s6', 4, false, false);
});

function setupListener(semester, index, hasTD, hasTP) {
    const ids = [`${semester}-m${index}-ex`, `${semester}-m${index}-td`, `${semester}-m${index}-tp`, `${semester}-m${index}-note`];
    ids.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => updateModule(semester, index, hasTD, hasTP));
        }
    });
}

function displayResult(moyenne, scoreId, statusId, boxId) {
    const scoreEl = document.getElementById(scoreId);
    const statusEl = document.getElementById(statusId);
    const boxEl = document.getElementById(boxId);
    
    scoreEl.textContent = moyenne.toFixed(2);
    
    if (moyenne >= 10) {
        statusEl.innerHTML = "✓ Admis(e)";
        statusEl.className = "result-status status-pass";
        scoreEl.style.color = "var(--success)";
    } else {
        statusEl.innerHTML = "⚠ Rattrapage";
        statusEl.className = "result-status status-fail";
        scoreEl.style.color = "var(--danger)";
    }
    
    boxEl.classList.remove("show");
    void boxEl.offsetWidth; 
    boxEl.classList.add("show");
}

function calculateS5() {
    try {
        const m1 = calculateModuleScore(getVal("s5-m1-ex"), getVal("s5-m1-td"), getVal("s5-m1-tp"), true, true);
        const m2 = calculateModuleScore(getVal("s5-m2-ex"), getVal("s5-m2-td"), getVal("s5-m2-tp"), true, true);
        const m3 = calculateModuleScore(getVal("s5-m3-ex"), getVal("s5-m3-td"), getVal("s5-m3-tp"), true, true);
        const m4 = calculateModuleScore(getVal("s5-m4-ex"), getVal("s5-m4-td"), 0, true, false);
        const m5 = calculateModuleScore(getVal("s5-m5-ex"), getVal("s5-m5-td"), getVal("s5-m5-tp"), true, true);
        const m6 = calculateModuleScore(getVal("s5-m6-ex"), getVal("s5-m6-td"), getVal("s5-m6-tp"), true, true);
        const m7 = calculateModuleScore(getVal("s5-m7-note"), 0, 0, false, false);

        if ([m1, m2, m3, m4, m5, m6, m7].some(val => val === null)) {
            alert("Veuillez remplir toutes les notes du Semestre 5.");
            return;
        }

        const total = (m1 * 3) + (m2 * 3) + (m3 * 3) + (m4 * 3) + (m5 * 3) + (m6 * 3) + (m7 * 1);
        const moyenne = total / 19;
        displayResult(moyenne, "score-s5", "status-s5", "result-s5");
    } catch (error) {
        alert(error.message);
    }
}

function calculateS6() {
    try {
        const m1 = calculateModuleScore(getVal("s6-m1-ex"), 0, getVal("s6-m1-tp"), false, true);
        const m2 = calculateModuleScore(getVal("s6-m2-ex"), getVal("s6-m2-td"), getVal("s6-m2-tp"), true, true);
        const m3 = calculateModuleScore(getVal("s6-m3-ex"), 0, getVal("s6-m3-tp"), false, true);
        const m4 = calculateModuleScore(getVal("s6-m4-note"), 0, 0, false, false);

        if ([m1, m2, m3, m4].some(val => val === null)) {
            alert("Veuillez remplir toutes les notes du Semestre 6.");
            return;
        }

        const total = (m1 * 4) + (m2 * 4) + (m3 * 3) + (m4 * 8);
        const moyenne = total / 19;
        displayResult(moyenne, "score-s6", "status-s6", "result-s6");
    } catch (error) {
        alert(error.message);
    }
}