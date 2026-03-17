const loadPartial = (selector, url) => {
  const target = document.querySelector(selector);
  if (!target) {
    return Promise.resolve(null);
  }

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      target.innerHTML = html;
      return target;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

const applyHomeLinks = (root) => {
  if (!root || document.body.dataset.page !== 'home') {
    return;
  }
  root.querySelectorAll('[data-home-href]').forEach((link) => {
    const href = link.getAttribute('data-home-href');
    if (href) {
      link.setAttribute('href', href);
    }
  });
};

const markActivePage = (root) => {
  const page = document.body.dataset.page;
  if (!root || !page) {
    return;
  }

  root.querySelectorAll('[data-page-target]').forEach((link) => {
    if (link.getAttribute('data-page-target') === page) {
      link.setAttribute('aria-current', 'page');
    }
  });
};

window.sitePartialsReady = Promise.all([
  loadPartial('.site-header', 'partials/header.html'),
  loadPartial('.site-footer', 'partials/footer.html'),
]).then(([header, footer]) => {
  applyHomeLinks(header);
  applyHomeLinks(footer);
  markActivePage(header);
  markActivePage(footer);
  return { header, footer };
});
