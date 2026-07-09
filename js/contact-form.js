(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn  = document.getElementById('form-btn');
  const note = document.getElementById('form-note');
  const originalBtnText = btn  ? btn.textContent.trim()  : 'Send Message →';
  const originalNote    = note ? note.textContent        : '';

  function setNote(msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.className   = 'form-note' + (type ? ' form-' + type : '');
    note.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  }

  function getErr(input) {
    return input.closest('.fg')?.querySelector('.field-error') || null;
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  }

  function validateField(input) {
    const err = getErr(input);
    if (!err) return true;
    let msg = '';
    if (input.validity.valueMissing) {
      msg = 'This field is required.';
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      msg = 'Enter a valid email address (e.g. name@domain.com).';
    } else if (!input.validity.valid) {
      msg = 'Please check this field.';
    }
    err.textContent = msg;
    return msg === '';
  }

  form.querySelectorAll('input[required], textarea[required], input[type="email"]').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const err = getErr(input);
      if (err && err.textContent && input.validity.valid) err.textContent = '';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
      if (!validateField(input)) valid = false;
    });
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !isValidEmail(emailInput.value)) {
      validateField(emailInput);
      valid = false;
    }

    if (!valid) {
      const firstErr = form.querySelector('.field-error:not(:empty)');
      if (firstErr) firstErr.closest('.fg')?.querySelector('input,textarea')?.focus();
      setNote('Please fix the highlighted fields before sending.', 'error');
      return;
    }

    btn.textContent = 'Sending…';
    btn.disabled = true;
    setNote('Sending your message…', '');

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 10000);

    const payload = Object.fromEntries(new FormData(form).entries());

    fetch('https://formsubmit.co/ajax/nrajitha142@gmail.com', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(() => {
        btn.textContent = '✓ Message sent!';
        btn.style.background = 'linear-gradient(135deg,#059669,#0891b2)';
        form.reset();
        setNote('Message sent — I will reply within 24 hours. Thank you!', 'success');
        note?.focus();
        setTimeout(() => {
          btn.textContent    = originalBtnText;
          btn.style.background = '';
          btn.disabled = false;
          setNote(originalNote, '');
        }, 4000);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        btn.textContent = originalBtnText;
        btn.disabled = false;
        const msg = err.name === 'AbortError'
          ? 'Request timed out — please try again or email nrajitha142@gmail.com directly.'
          : 'Something went wrong — please email nrajitha142@gmail.com directly.';
        setNote(msg, 'error');
        setTimeout(() => setNote(originalNote, ''), 7000);
      });
  });
})();