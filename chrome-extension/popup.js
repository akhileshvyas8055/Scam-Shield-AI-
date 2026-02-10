const API_URL = 'http://localhost:5000/api';

document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const offerText = document.getElementById('offerText').value;
  const email = document.getElementById('email').value;
  const website = document.getElementById('website').value;
  
  if (!offerText.trim()) {
    alert('Please paste the internship offer text');
    return;
  }
  
  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  btn.textContent = 'Analyzing...';
  
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offer_text: offerText,
        email: email,
        website: website,
        stipend: '',
        fees_required: false
      })
    });
    
    const result = await response.json();
    displayResult(result);
  } catch (error) {
    alert('Error analyzing offer. Make sure the backend is running.');
    console.error(error);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Analyze Now';
  }
});

function displayResult(result) {
  const resultDiv = document.getElementById('result');
  const scoreDiv = document.getElementById('score');
  const verdictDiv = document.getElementById('verdict');
  const reasonsList = document.getElementById('reasonsList');
  
  scoreDiv.textContent = `${result.scam_score}%`;
  verdictDiv.textContent = result.verdict;
  
  reasonsList.innerHTML = '';
  result.reasons.forEach(reason => {
    const li = document.createElement('li');
    li.textContent = reason;
    reasonsList.appendChild(li);
  });
  
  resultDiv.className = 'result show';
  if (result.color === 'green') {
    resultDiv.classList.add('safe');
  } else if (result.color === 'yellow') {
    resultDiv.classList.add('suspicious');
  } else {
    resultDiv.classList.add('danger');
  }
}
