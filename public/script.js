document.addEventListener('DOMContentLoaded', async () => {
    const videoGrid = document.querySelector('.video-grid');

    // Fetch and display videos
    try {
        const response = await fetch('http://localhost:5500/videos'); // Backend API to fetch videos
        if (!response.ok) throw new Error('Network response was not ok');

        const videos = await response.json();

        // Clear existing content
        videoGrid.innerHTML = '';

        // Dynamically add videos
        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');
            videoCard.innerHTML = `
                <img src="${video.thumbnailUrl}" alt="${video.title}" class="video-thumbnail">
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                </div>`;

            // Event listener to open the video in a modal or new page
            videoCard.addEventListener('click', () => {
                window.open(video.videoUrl, '_blank');
            });

            videoGrid.appendChild(videoCard);
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        videoGrid.innerHTML = '<p>Failed to load videos. Please try again later.</p>';
    }

    // Initialize Google Sign-In
    initializeGoogleSignIn();
});

// Google Sign-In integration
function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: '384206413256-7eouvqlq8gfgd2oeoj9iq9em2c30ofpc.apps.googleusercontent.com', // Replace with your actual client ID
        callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
        document.getElementById('google-signin-button'), // Replace with your button's ID
        { theme: 'outline', size: 'large' } // Customize as needed
    );

    google.accounts.id.prompt(); // Automatically shows a prompt for returning users
}

function handleCredentialResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);

    // Optionally, send the ID token to your backend for further verification
    fetch('http://localhost:5500/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
    })
    .then(res => res.json())
    .then(data => console.log('User verified:', data))
    .catch(err => console.error('Verification failed:', err));
}
