// main.js

function extractKeywords(text) {
    // Basic keyword extraction: split, lowercase, remove stopwords
    const stopwords = new Set(["the","and","with","for","from","that","this","are","was","were","has","have","had","but","not","all","any","can","will","shall","may","might","must","should","a","an","of","in","on","to","by","as","at","is","it","or","be","if","so","do","does","did","we","you","he","she","they","them","their","our","your","his","her","its","which"]);
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(word => word && !stopwords.has(word));
}

function scoreResume(jdKeywords, resumeText) {
    const resumeWords = new Set(extractKeywords(resumeText));
    let matched = jdKeywords.filter(word => resumeWords.has(word));
    let score = jdKeywords.length ? (matched.length / jdKeywords.length) * 100 : 0;
    return { score: Math.round(score), matched };
}

// Store uploaded resumes' text
let uploadedResumes = [];

// Handle file input change
const fileInput = document.getElementById('resume-upload');
fileInput.addEventListener('change', handleFiles);

// Handle drag and drop
const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    handleFiles({ target: { files: e.dataTransfer.files } });
});

function handleFiles(e) {
    const files = Array.from(e.target.files);
    uploadedResumes = [];
    let readCount = 0;
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(ev) {
            uploadedResumes.push(ev.target.result);
            readCount++;
            if (readCount === files.length) {
                dropArea.textContent = `${files.length} file(s) uploaded.`;
            }
        };
        // Only read as text (for .txt, .docx, etc.)
        reader.readAsText(file);
    });
}

function extractCandidateName(resumeText) {
    // Get the first non-empty line as the candidate name
    const lines = resumeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.length > 0 ? lines[0] : 'Unknown Candidate';
}

document.getElementById('score').onclick = function() {
    const jdText = document.getElementById('jd').value;
    const jdKeywords = Array.from(new Set(extractKeywords(jdText)));
    let resumes = uploadedResumes;
    if (resumes.length === 0) {
        alert('Please upload at least one resume.');
        return;
    }
    let results = resumes.map((resume, idx) => {
        const { score, matched } = scoreResume(jdKeywords, resume);
        const name = extractCandidateName(resume);
        return { idx: idx + 1, score, matched, name };
    });
    results.sort((a, b) => b.score - a.score);
    const top5 = results.slice(0, 5);
    let html = '<h2>Top 5 Candidates</h2><ol>';
    top5.forEach(r => {
        html += `<li><strong>${r.name}</strong>: Score <b>${r.score}%</b><br>Matched keywords: <span style="color:green">${r.matched.join(', ')}</span></li>`;
    });
    html += '</ol>';
    document.getElementById('results').innerHTML = html;
};
