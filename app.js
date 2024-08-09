document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                const data = results.data;
                generateInsights(data);
                generateWordCloud(data);
            }
        });
    }
}

function generateInsights(data) {
    const insightsElement = document.getElementById('insights');
    let insightsHtml = '';

    // Example: count the most frequent answer for a specific question (column)
    const question1Responses = data.map(row => row['(1)']).filter(Boolean);
    const frequencyMap = question1Responses.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
    const mostFrequentResponse = Object.keys(frequencyMap).reduce((a, b) => frequencyMap[a] > frequencyMap[b] ? a : b);

    insightsHtml += `<p>Most common response for question 1: <strong>${mostFrequentResponse}</strong></p>`;
    
    // Add more insights here

    insightsElement.innerHTML = insightsHtml;
}

function generateWordCloud(data) {
    const canvas = document.getElementById('wordCloudCanvas');
    const ctx = canvas.getContext('2d');

    const textData = data.map(row => row['(11)']).join(' ');
    const wordCounts = countWords(textData);
    
    const maxFontSize = 50;
    const minFontSize = 10;
    const maxCount = Math.max(...Object.values(wordCounts));

    let x = 20, y = 50;

    Object.entries(wordCounts).forEach(([word, count]) => {
        const fontSize = Math.floor((count / maxCount) * (maxFontSize - minFontSize) + minFontSize);
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(word, x, y);
        x += ctx.measureText(word).width + 20;
        if (x > canvas.width - 100) {
            x = 20;
            y += fontSize + 10;
        }
    });
}

function countWords(text) {
    const words = text.split(/\s+/).filter(Boolean);
    return words.reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});
}
