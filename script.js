/* RD7 Publicidade — interações leves, acessíveis e sem bibliotecas externas. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  // Os ícones não dependem de glifos Unicode: sempre SVG vetorial.
  const makeIcon = (name, extraClass = '') => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', `icon ${extraClass}`.trim());
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS(svgNS, 'use');
    use.setAttribute('href', `#rd7-${name}`);
    svg.appendChild(use);
    return svg;
  };
  const config = window.RD7_CONFIG || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navegação para celular.
  const toggle = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const header = $('.site-header');
  function setMenu(isOpen) {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.classList.toggle('is-open', isOpen);
    mobileMenu.inert = !isOpen;
    document.body.classList.toggle('menu-open', isOpen);
  }
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (toggle?.getAttribute('aria-expanded') === 'true' && header && !header.contains(event.target)) setMenu(false);
  });
  const desktopMedia = window.matchMedia('(min-width: 981px)');
  desktopMedia.addEventListener?.('change', event => { if (event.matches) setMenu(false); });
  window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 16), { passive: true });
  header?.classList.toggle('is-scrolled', window.scrollY > 16);

  // Revelações discretas na rolagem; nunca ocultar conteúdo sem suporte à API.
  const reveals = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          self.unobserve(entry.target);
        }
      });
    }, { threshold: .07, rootMargin: '0px 0px 35px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // Destacar a seção navegada sem substituir o funcionamento padrão das âncoras.
  if ('IntersectionObserver' in window) {
    const navLinks = $$('.desktop-nav a');
    const navObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navLinks.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-25% 0px -62% 0px' });
    $$('.section-anchor').forEach(section => navObserver.observe(section));
  }

  // Accordions: todos fechados por padrão. Somente um aberto por vez.
  const serviceItems = $$('.service-item');
  serviceItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      serviceItems.forEach(other => { if (other !== item) other.open = false; });
    });
  });

  // Links de redes sociais: aparecem somente após configuração pelo dono do site.
  const whatsapp = String(config.whatsapp || '').replace(/\D/g, '');
  const hasWhatsapp = whatsapp.length >= 11 && whatsapp.length <= 15;
  const email = String(config.email || '').trim().toLowerCase();
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Botão de WhatsApp independente do formulário, sempre com o número configurado.
  const floatWhatsApp = $('#whatsapp-float');
  if (floatWhatsApp && hasWhatsapp) {
    const greeting = 'Olá! Vim pelo site da RD7 Publicidade e gostaria de conversar sobre um projeto.';
    floatWhatsApp.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(greeting)}`;
    floatWhatsApp.hidden = false;
  }

  // Contatos visíveis para quem prefere chamar diretamente ou enviar e-mail.
  const contactDirect = $('#contact-direct');
  const addContact = (label, url, iconName, external = false) => {
    if (!contactDirect) return;
    const link = document.createElement('a');
    link.href = url;
    if (external) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    link.appendChild(makeIcon(iconName));
    link.appendChild(document.createTextNode(label));
    contactDirect.appendChild(link);
  };
  if (hasWhatsapp) {
    const local = whatsapp.startsWith('55') ? whatsapp.slice(2) : whatsapp;
    const formatted = /^\d{11}$/.test(local)
      ? `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`
      : local;
    addContact(`WhatsApp: ${formatted}`, `https://wa.me/${whatsapp}`, 'whatsapp', true);
  }
  if (hasEmail) addContact(email, `mailto:${email}`, 'mail');
  if (contactDirect && !contactDirect.children.length) contactDirect.hidden = true;

  const socialLinks = $('#social-links');
  const socialEntries = [['Instagram', config.instagram], ['LinkedIn', config.linkedin]];
  if (hasWhatsapp) socialEntries.push(['WhatsApp', `https://wa.me/${whatsapp}`]);
  socialEntries.forEach(([label, value]) => {
    if (!value || !socialLinks) return;
    try {
      const url = new URL(String(value));
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
      const anchor = document.createElement('a');
      anchor.textContent = label;
      anchor.href = url.toString();
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      socialLinks.appendChild(anchor);
    } catch (_) { /* Ignorar links não configurados ou malformados. */ }
  });
  if (socialLinks && socialLinks.querySelectorAll('a').length === 0) socialLinks.hidden = true;

  // Envio do formulário: FormSubmit encaminha o briefing por e-mail.
  // Em hospedagem estática (GitHub Pages) não existe backend próprio de e-mail.
  const form = $('#contact-form');
  const formError = $('#form-error');
  const formSuccess = $('#form-success');
  const formSubmit = $('#form-submit');
  const fallback = $('#form-fallback');
  const normalize = value => String(value || '').trim();
  const readValue = id => normalize($('#' + id)?.value);
  let submitting = false;

  if (form && hasEmail) {
    // Mantém o endereço centralizado em site.config.js para futuras alterações.
    form.action = `https://formsubmit.co/${encodeURIComponent(email)}`;
  }
  fallback?.addEventListener('click', () => {
    if (!form || !hasEmail || submitting) return;
    // POST tradicional: pode abrir a etapa de verificação/captcha do FormSubmit.
    form.submit();
  });

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    formError.hidden = true;
    formSuccess.hidden = true;
    fallback.hidden = true;

    if (!hasEmail) {
      formError.textContent = 'O e-mail de atendimento não está configurado. Entre em contato pelo WhatsApp.';
      formError.hidden = false;
      return;
    }

    const fields = [$('#nome'), $('#whatsapp'), $('#email'), $('#assunto'), $('#mensagem')];
    for (const field of fields) {
      if (!field || !field.validity.valid) {
        formError.textContent = 'Confira os campos obrigatórios antes de enviar.';
        formError.hidden = false;
        field?.reportValidity();
        field?.focus();
        return;
      }
    }
    const phone = readValue('whatsapp').replace(/\D/g, '');
    if (phone.length < 10 || phone.length > 15) {
      formError.textContent = 'Digite um WhatsApp válido com DDD.';
      formError.hidden = false;
      $('#whatsapp').focus();
      return;
    }
    // Se o campo antispam for preenchido por um bot, descartamos o envio.
    if (form.elements.namedItem('_honey')?.value) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    payload._subject = `Novo projeto pelo site RD7 — ${readValue('assunto')}`;
    payload._url = location.href.split('#')[0];
    submitting = true;
    formSubmit.disabled = true;
    formSubmit.setAttribute('aria-busy', 'true');
    formSubmit.firstChild.textContent = 'Enviando... ';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true')) {
        throw new Error('O serviço de envio não confirmou o recebimento.');
      }
      form.reset();
      formSuccess.hidden = false;
      formSuccess.focus({ preventScroll: true });
      formSuccess.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    } catch (_) {
      // Não declara sucesso se houve erro de rede ou o serviço não confirmou.
      formError.textContent = 'Não foi possível confirmar o envio. Tente novamente ou use o envio alternativo.';
      formError.hidden = false;
      fallback.hidden = false;
    } finally {
      submitting = false;
      formSubmit.disabled = false;
      formSubmit.removeAttribute('aria-busy');
      formSubmit.firstChild.textContent = 'Enviar projeto ';
    }
  });
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
