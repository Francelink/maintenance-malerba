window.addEventListener('DOMContentLoaded', () => {
    i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            backend: { loadPath: "./config/{{lng}}.json" },
            supportedLngs: false,
            load: "languageOnly",
            detection: {
                order: ["querystring", "navigator"],
                caches: [] // pas de localStorage
            },
            fallbackLng: "fr",
        })
        .then(() => {
            const bodyPage = document.querySelector('.maintenance-page');
            if (!bodyPage) return;

            fetch('./config/settings.json')
                .then(res => res.json())
                .then(cfg => {
                    // 1) mettre à jour le <title>
                    const pageTitleEl = document.getElementById('page-title');
                    if (pageTitleEl && cfg.projectName) pageTitleEl.innerHTML = `${cfg.projectName} – Maintenance`;


                    // 2) textes
                    const titleEl = document.getElementById('title');
                    if (titleEl && i18next.t("mainMessage")) titleEl.innerHTML = i18next.t("mainMessage");

                    const slogan = document.getElementById('slogan');
                    if (slogan && cfg.slogan) slogan.innerHTML = cfg.slogan;

                    const subtitleEl = document.getElementById('subtitle');
                    if (subtitleEl && i18next.t("subMessage")) subtitleEl.innerHTML = i18next.t("subMessage");

                    const contactHeadingEl = document.getElementById('contact-heading');
                    if (contactHeadingEl && i18next.t("contactHeading")) contactHeadingEl.textContent = i18next.t("contactHeading") + ' :';

                    const contactPhoneHeadingEl = document.getElementById('contact-phone-heading');
                    if (contactPhoneHeadingEl && i18next.t("contactPhoneHeading")) contactPhoneHeadingEl.textContent = i18next.t("contactPhoneHeading") + ' :';

                    const emailEl = document.getElementById('contact-email');
                    if (emailEl) {
                        if (cfg.contactEmail) {
                            emailEl.href = 'mailto:' + cfg.contactEmail;
                            emailEl.textContent = cfg.contactEmail;
                        } else {
                            const emailContainer = document.getElementById('contact-email-container');
                            if (emailContainer) emailContainer.style.display = 'none';
                        }
                    }

                    const phoneEl = document.getElementById('contact-phone');
                    if (phoneEl) {
                        if (cfg.contactPhone) {
                            phoneEl.href = 'tel:' + cfg.contactPhone;
                            phoneEl.textContent = cfg.contactPhone;
                        } else {
                            const phoneContainer = document.getElementById('contact-phone-container');
                            if (phoneContainer) phoneContainer.style.display = 'none';
                        }
                    }

                    // 3) surcharge des couleurs
                    const rootStyle = document.documentElement.style;
                    if (cfg.primaryColor) rootStyle.setProperty('--primary-color', cfg.primaryColor);
                    if (cfg.secondaryColor) rootStyle.setProperty('--secondary-color', cfg.secondaryColor);
                    if (cfg.backgroundColor) rootStyle.setProperty('--background-color', cfg.backgroundColor);
                    if (cfg.textColor) rootStyle.setProperty('--text-color', cfg.textColor);

                    // 4) gestion du logo
                    const logoContainer = document.querySelector('.logo');
                    const logoEl = document.getElementById('logo');
                    if (logoContainer && logoEl && cfg.logoUrl) {
                        const logoUrl = window.location.href + 'assets/' + cfg.logoUrl;
                        fetch(logoUrl, { method: 'HEAD' })
                            .then(response => {
                                if (response.ok) {
                                    logoEl.src = logoUrl;
                                    logoEl.alt = cfg.projectName + ' Logo';
                                } else {
                                    logoContainer.style.display = 'none';
                                }
                            })
                            .catch(() => {
                                logoContainer.style.display = 'none';
                            });
                    } else {
                        logoContainer.style.display = 'none';
                    }

                    // 5) gestion image de fond
                    const contentDiv = document.querySelector('.content');
                    if (contentDiv && cfg.mainImage) {
                        const mainImageUrl = window.location.href + '/assets/' + cfg.mainImage;
                        fetch(mainImageUrl, { method: 'HEAD' })
                            .then(response => {
                                if (response.ok) {
                                    contentDiv.style.backgroundImage = `url('${mainImageUrl}')`;
                                    contentDiv.style.backgroundSize = 'cover';
                                    contentDiv.style.backgroundPosition = 'center';
                                    bodyPage.classList.add('has-image');
                                }
                            })
                            .catch(() => {
                                // on ignore l'erreur réseau
                            });
                    }

                    bodyPage.classList.add('loaded');
                })
                .catch(err => {
                    console.error('Erreur chargement config :', err);
                });
        });
});