document.addEventListener('DOMContentLoaded', function () {
    let siteListElement = document.getElementById('siteList');
    let totalTimeElement = document.getElementById('totalTime');
    const siteNames = {
        "www.google.com": "Google",
        "www.tiktok.com": "TikTok",
        "github.com": "GitHub",
        "chatgpt.com": "ChatGPT",
        "extensions": "Chrome Extensions",
        "newtab": "New Tab"
    };

    function formatTime(seconds) {
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;

        if (mins > 0 && mins < 60) {
            return `${mins}m ${secs}s`;
        }else if (mins > 59){
            return `${hours}h ${remainingMins}m`;
        }

        return `${secs}s`;
    }

    chrome.storage.local.get('siteTime', function (result) {
        let siteTime = result.siteTime || {};

        siteListElement.innerHTML = '';

        const totalSeconds = Object.values(siteTime)
            .reduce((sum, time) => sum + time, 0);

        totalTimeElement.textContent = formatTime(totalSeconds);

        const sortedSites = Object.entries(siteTime)
            .sort((a, b) => b[1] - a[1]);

        const maxTime = Math.max(...Object.values(siteTime));

        sortedSites.forEach(([url, timeSpent], index) => {
            let percentage = (timeSpent / maxTime) * 100;

            let element = document.createElement('div');
            element.className = 'site-card';
            const badge =
                index === 0
                    ? '<div class="top-site-badge">TOP SITE</div>'
                    : '';
            element.innerHTML = `
                ${badge}
                <div class="site-info">

                    <div class="site-left">
                        <img
                            class="favicon"
                            src="https://www.google.com/s2/favicons?domain=${url}&sz=32"
                            alt=""
                        >

                        <span class="site-name">
                            ${siteNames[url] || url}
                        </span>
                    </div>

                    <span class="site-time">
                        ${formatTime(timeSpent)}
                    </span>

                </div>

                <div class="progress">
                    <div class="progress-fill" style="width:${percentage}%"></div>
                </div>
            `;

            siteListElement.appendChild(element);
        });

        if (sortedSites.length === 0) {
            let noDataElement = document.createElement('div');
            noDataElement.className = 'site-card';
            noDataElement.textContent = 'No data available.';
            siteListElement.appendChild(noDataElement);
        }
    });
});