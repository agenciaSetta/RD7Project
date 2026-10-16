/* RD7 Publicidade — interações leves, acessíveis e sem bibliotecas externas. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
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
  const email = String(config.email || '').trim();
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  // Formulário sem backend: prepara o texto e oferece os canais reais.
  const form = $('#contact-form');
  const formError = $('#form-error');
  const dialog = $('#message-dialog');
  const messagePreview = $('#message-preview');
  const actions = $('#message-actions');
  const status = $('#message-status');
  const closeDialog = $('.dialog-close');
  const normalize = value => String(value || '').trim();
  const readValue = id => normalize($('#' + id)?.value);

  const addLink = (label, href, options = {}) => {
    if (!actions) return;
    const a = document.createElement('a');
    a.textContent = label;
    a.href = href;
    if (options.external) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    actions.appendChild(a);
  };

  form?.addEventListener('submit', event => {
    event.preventDefault();
    formError.hidden = true;
    const fields = [$('#nome'), $('#whatsapp'), $('#email'), $('#assunto'), $('#mensagem')];
    for (const field of fields) {
      if (!field || !field.validity.valid) {
        formError.textContent = 'Confira os campos obrigatórios antes de continuar.';
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
    const briefing = [
      'Olá, RD7! Tenho interesse em conversar sobre um projeto.',
      '',
      `Nome: ${readValue('nome')}`,
      ...(readValue('empresa') ? [`Empresa/marca: ${readValue('empresa')}`] : []),
      `WhatsApp: ${readValue('whatsapp')}`,
      `E-mail: ${readValue('email')}`,
      `Interesse: ${readValue('assunto')}`,
      '',
      'Sobre o projeto:',
      readValue('mensagem')
    ].join('\n');

    if (!dialog || !messagePreview || !actions) return;
    messagePreview.value = briefing;
    actions.replaceChildren();
    status.textContent = '';

    if (hasWhatsapp) addLink('Abrir WhatsApp ↗', `https://wa.me/${whatsapp}?text=${encodeURIComponent(briefing)}`, { external: true });
    if (hasEmail) {
      const subject = `Novo contato pelo site RD7 — ${readValue('assunto')}`;
      addLink('Abrir e-mail ↗', `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefing)}`);
    }

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.textContent = 'Copiar mensagem';
    copyButton.addEventListener('click', async () => {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(messagePreview.value);
        else {
          messagePreview.select();
          if (!document.execCommand('copy')) throw new Error('Cópia indisponível');
        }
        copyButton.textContent = 'Copiado ✓';
        status.textContent = 'Mensagem copiada. Você pode colá-la no canal de contato desejado.';
      } catch (_) {
        messagePreview.focus();
        messagePreview.select();
        status.textContent = 'Selecione e copie o texto acima manualmente.';
      }
    });
    actions.appendChild(copyButton);
    if (!hasWhatsapp && !hasEmail) {
      status.textContent = 'Os canais de atendimento ainda não foram configurados. Copie a mensagem para enviá-la manualmente.';
    }
    dialog.showModal();
  });
  closeDialog?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
