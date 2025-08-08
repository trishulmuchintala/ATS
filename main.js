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

document.getElementById('add-resume').onclick = function() {
    const container = document.getElementById('resumes-container');
    const textarea = document.createElement('textarea');
    textarea.className = 'resume';
    textarea.rows = 6;
    textarea.placeholder = `Paste resume ${container.children.length + 1} here...`;
    container.appendChild(textarea);
};

document.getElementById('score').onclick = function() {
    const jdText = document.getElementById('jd').value;
    const jdKeywords = Array.from(new Set(extractKeywords(jdText)));
    const resumes = Array.from(document.getElementsByClassName('resume')).map(t => t.value);
    let results = resumes.map((resume, idx) => {
        const { score, matched } = scoreResume(jdKeywords, resume);
        return { idx: idx + 1, score, matched };
    });
    results.sort((a, b) => b.score - a.score);
    const top5 = results.slice(0, 5);
    let html = '<h2>Top 5 Candidates</h2><ol>';
    top5.forEach(r => {
        html += `<li><strong>Resume ${r.idx}</strong>: Score <b>${r.score}%</b><br>Matched keywords: <span style="color:green">${r.matched.join(', ')}</span></li>`;
    });
    html += '</ol>';
    document.getElementById('results').innerHTML = html;
};
