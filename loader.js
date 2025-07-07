async function loadComponent(url, placeholderId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const text = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.outerHTML = text;
        } else {
            console.error(`Placeholder element with ID '${placeholderId}' not found.`);
        }
    } catch (error) {
        console.error(`Error loading component from ${url}:`, error);
    }
}

async function loadHTML() {
    await Promise.all([
        loadComponent('_header.html', 'header-placeholder'),
        loadComponent('_sidebars.html', 'sidebars-placeholder'),
        loadComponent('_main.html', 'main-placeholder'),
        loadComponent('_modals.html', 'modals-placeholder'),
        loadComponent('_footer.html', 'footer-placeholder')
    ]);
}

export { loadHTML };