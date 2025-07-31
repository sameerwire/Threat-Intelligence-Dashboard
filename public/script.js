document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'http://localhost:3000/api/threats'; // URL of your local backend

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const threats = await response.json();

        if (Array.isArray(threats)) {
            const threatsDiv = document.getElementById('threats');
            threatsDiv.innerHTML = ''; // Clear any existing content

            threats.forEach(threat => {
                const threatDiv = document.createElement('div');
                threatDiv.classList.add('threat-item');  // Add the threat-item class

                const threatIndicator = document.createElement('h3');
                threatIndicator.textContent = `Indicator: ${threat.indicator}`;
                threatIndicator.classList.add('blink');  // Add blinking effect
                threatDiv.appendChild(threatIndicator);

                const threatDescription = document.createElement('p');
                threatDescription.textContent = `Description: ${threat.description}`;
                threatDiv.appendChild(threatDescription);

                const threatDate = document.createElement('p');
                threatDate.textContent = `Date: ${new Date(threat.created).toLocaleDateString()}`;
                threatDiv.appendChild(threatDate);

                threatsDiv.appendChild(threatDiv);
            });

            // Create chart
            const ctx = document.getElementById('threatChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: threats.map(t => t.indicator || 'No indicator'),
                    datasets: [{
                        label: 'Threat Severity',
                        data: threats.map(t => {
                            // Dummy data for severity (replace with actual field if available)
                            return Math.floor(Math.random() * 4) + 1;
                        }),
                        backgroundColor: 'rgba(0, 255, 0, 0.2)', // Green background color with opacity
						borderColor: 'rgba(0, 255, 0, 1)', // Green border color
                        borderWidth: 1
                    }]
                },
                options: {
					maintainAspectRatio: false,
					responsive: true,

                    scales: {
                        x: {
                            ticks: {
                                callback: function(value, index, values) {
                                    const label = this.getLabelForValue(value);
                                    // Limit label length
                                    return label.length > 10 ? label.substring(0, 10) + '...' : label;
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    switch (value) {
                                        case 1: return 'Low';
                                        case 2: return 'Medium';
                                        case 3: return 'High';
                                        case 4: return 'Critical';
                                        default: return '';
                                    }
                                }
                            }
                        }
                    }
                }
            });
        } else {
            console.error('Data is not an array:', threats);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
	
});

async function submitFile() {
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/api/submit-file', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        console.error('Error submitting file:', error);
    }
}

async function submitURL() {
    const urlInput = document.getElementById('urlInput').value;

    try {
        const response = await fetch('/api/submit-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: urlInput })
        });

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        console.error('Error submitting URL:', error);
    }
}

function displayResults(result) {
    const resultsDiv = document.getElementById('submission-results');
    resultsDiv.innerHTML = ''; // Clear any existing content

    // Display message
    const messagePara = document.createElement('p');
    messagePara.textContent = `Message: ${result.message}`;
    resultsDiv.appendChild(messagePara);

    // Display submission result
    const submissionResultPara = document.createElement('p');
    submissionResultPara.textContent = `Submission Result: Status - ${result.submissionResult.status}, Result - ${result.submissionResult.result}`;
    resultsDiv.appendChild(submissionResultPara);

    // Display detail result in a more readable format
    const detailResultDiv = document.createElement('div');
    detailResultDiv.innerHTML = `
        <h3>Detail Result:</h3>
        <p>Indicator: ${result.detailResult.indicator || 'Unavailable'}</p>
        <p>Type: ${result.detailResult.type_title || 'Unavailable'}</p>
        <p>Domain: ${result.detailResult.domain || 'Unavailable'}</p>
        <p>Hostname: ${result.detailResult.hostname || 'Unavailable'}</p>
        <p>Alexa Rank: <a href="${result.detailResult.alexa}" target="_blank">${result.detailResult.alexa || 'Unavailable'}</a></p>
        <p>Whois: <a href="${result.detailResult.whois}" target="_blank">${result.detailResult.whois || 'Unavailable'}</a></p>
        <h4>Pulse Info:</h4>
        <p>Count: ${result.detailResult.pulse_info.count}</p>
        <p>Pulses: ${result.detailResult.pulse_info.pulses.length > 0 ? result.detailResult.pulse_info.pulses.map(pulse => pulse.name).join(', ') : 'None'}</p>
    `;
    resultsDiv.appendChild(detailResultDiv);

    // Show submission results section heading and results with fade-in effect
    const submissionResultsHeading = document.getElementById('submissionResultsHeading');
    submissionResultsHeading.style.transition = 'opacity 0.5s ease';
    submissionResultsHeading.style.opacity = '1';

    resultsDiv.style.transition = 'opacity 2s ease';
    resultsDiv.style.opacity = '1';
}


document.getElementById('submitForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('urlInput').value;
    const file = document.getElementById('fileInput').files[0];

    if (url) {
        submitURL();
    } else if (file) {
        submitFile();
    } else {
        alert('Please provide either a URL or a file to submit.');
    }
});


