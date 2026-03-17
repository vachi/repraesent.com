/**
 * Lead form handler — POSTs to existing contact endpoint.
 * Set FORM_ENDPOINT to your endpoint URL (same as reference contact form) before deployment.
 * Endpoint accepts JSON: name, email, message, product_interest, company, consent_marketing, consent_privacy.
 */
(function () {
  const FORM_ENDPOINT = ''; // Set to your POST endpoint URL

  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('cf-feedback');

  if (!form || !feedback) return;

  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.className = 'form-feedback ' + (type === 'success' ? 'success' : 'error');
  }

  function hideFeedback() {
    feedback.hidden = true;
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideFeedback();

    if (!FORM_ENDPOINT) {
      showFeedback('Formular-Endpunkt nicht konfiguriert. Bitte FORM_ENDPOINT in js/form.js setzen.', 'error');
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      message: formData.get('message') || '',
      product_interest: formData.get('product_interest') || '',
      company: formData.get('company') || '',
      consent_marketing: formData.get('consent_marketing') === 'on',
      consent_privacy: formData.get('consent_privacy') === 'on',
    };

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(res.statusText || 'Fehler beim Senden');
      }

      const lang = document.documentElement.lang || 'de';
      showFeedback(
        lang === 'de'
          ? 'Vielen Dank. Ein Vertriebsmitarbeiter meldet sich bei Ihnen.'
          : 'Thank you. A sales representative will get back to you.',
        'success'
      );
      form.reset();
    } catch (err) {
      const lang = document.documentElement.lang || 'de';
      showFeedback(
        lang === 'de'
          ? 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.'
          : 'Something went wrong. Please try again later or contact us directly.',
        'error'
      );
    }
  });
})();
