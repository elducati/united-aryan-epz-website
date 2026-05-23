"const COMPONENTS = {
    header: `
    <header class="modern-nav">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div class="nav-logo">
                <a href="index.html">
                    <img src="img/newlogo.png" alt="United Aryan EPZ Logo">
                </a>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="index.html" class="nav-item">Home</a></li>
                    <li class="dropdown">
                        <a href="#" class="nav-item">About Us ▾</a>
                        <ul class="dropdown-menu">
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="assets/UAL - Company Profile.pdf" target="_blank">Our Profile</a></li>
                            <li><a href="sustainability.html">Sustainability</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="nav-item">What we Do ▾</a>
                        <ul class="dropdown-menu">
                            <li><a href="pline.html">Product Line</a></li>
                            <li><a href="logistics.html">Logistics</a></li>
                            <li><a href="served.html">Customers Served</a></li>
                            <li><a href="facility.html">Facility</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="nav-item">Products ▾</a>
                        <ul class="dropdown-menu">
                            <li><a href="product-profile.html">Product Profile</a></li>
                            <li><a href="woven.html">Woven Products</a></li>
                            <li><a href="knits.html">Knit Products</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="nav-item">Infrastructure ▾</a>
                        <ul class="dropdown-menu">
                            <li><a href="infrastructure.html">Infrastructure</a></li>
                            <li><a href="factory_photos.html">Factory Photos</a></li>
                        </ul>
                    </li>
                    <li><a href="contact.html" class="nav-item">Contact Us</a></li>
                </ul>
            </nav>
        </div>
    </header>
    `,
    footer: `
    <footer style="background: var(--primary-color); color: white; padding: var(--space-xl) 0; margin-top: var(--space-xl);">
        <div class="container" style="text-align: center;">
            <p>&copy; ${new Date().getFullYear()} United Aryan EPZ. All Rights Reserved.</p>
            <div style="margin-top: var(--space-md); display: flex; justify-content: center; gap: var(--space-md);">
                <a href="contact.html" style="color: white; text-decoration: none; font-size: 0.9rem;">Privacy Policy</a>
                <a href="contact.html" style="color: white; text-decoration: none; font-size: 0.9rem;">Terms of Service</a>
            </div>
        </div>
    </footer>
    `
};

function initComponents() {
    const headerPlaceholder = document.getElementById('site-header');
    const footerPlaceholder = document.getElementById('site-footer');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = COMPONENTS.header;
    }
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = COMPONENTS.footer;
    }

    // Handle active state
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop() || 
            (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', initComponents);
"