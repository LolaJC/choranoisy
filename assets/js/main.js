
document.addEventListener('DOMContentLoaded', function () {

  /* ---- en-tête : ombre après un léger scroll ---- */
  var head = document.querySelector('header.site-head');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- révélation au scroll (un seul motif, discret) ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---- lightbox : agrandir une photo au clic ---- */
  var lbImages = document.querySelectorAll('img[data-lightbox]');
  if (lbImages.length) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = '<button class="close" type="button" aria-label="Fermer">&times;</button><img alt="">';
    document.body.appendChild(overlay);
    var overlayImg = overlay.querySelector('img');
    var closeBtn = overlay.querySelector('.close');

    var open = function (src, alt) {
      overlayImg.src = src;
      overlayImg.alt = alt || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    var close = function () {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    lbImages.forEach(function (img) {
      img.addEventListener('click', function () {
        open(img.getAttribute('src'), img.getAttribute('alt'));
      });
    });
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---- formulaire de contact : envoi direct sans client mail ---- */
  var form = document.querySelector('form[data-contact-form]');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi…';
      status.className = 'form-status';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            status.textContent = 'Merci, votre message a bien été envoyé !';
            status.className = 'form-status ok';
          } else {
            status.textContent = "Le message n'a pas pu être envoyé. Réessayez ou écrivez-nous directement par e-mail.";
            status.className = 'form-status error';
          }
        })
        .catch(function () {
          status.textContent = "Le message n'a pas pu être envoyé. Réessayez ou écrivez-nous directement par e-mail.";
          status.className = 'form-status error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer mon message';
        });
    });
  }
});
