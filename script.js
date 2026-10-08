/* RD7 Publicidade — interações do site (JavaScript puro, sem dependências) */
(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const config = window.RD7_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const services = {
    estrategia: {
      number: '01 / ESTRATÉGIA & COMUNICAÇÃO',
      title: 'ESTRATÉGIA & COMUNICAÇÃO',
      description: 'Estratégia para saber o que dizer, para quem dizer e como chegar lá. Desenvolvemos caminhos alinhados aos objetivos de cada projeto, levando em conta público, posicionamento, canais, linguagem e resultados.',
      items: ['Planejamento de comunicação', 'Posicionamento de marca', 'Estratégia de conteúdo', 'Planejamento de campanhas', 'Estratégia digital', 'Comunicação institucional', 'Comunicação pública', 'Consultoria de comunicação', 'Gestão de crise']
    },
    audiovisual: {
      number: '02 / PRODUÇÃO AUDIOVISUAL',
      title: 'PRODUÇÃO AUDIOVISUAL',
      description: 'Conteúdo que parece profissional porque é produzido profissionalmente. Você grava uma vez; a RD7 transforma esse material em novas possibilidades de comunicação.',
      items: ['Produção de vídeos', 'Podcasts', 'Videocasts', 'Entrevistas', 'Programas', 'Reels', 'Shorts', 'Vídeos institucionais', 'Vídeos publicitários', 'Captação multicâmera', 'Edição', 'Motion graphics', 'Cortes para redes sociais', 'Cenários e formatos personalizados']
    },
    digital: {
      number: '03 / DIGITAL & CONTEÚDO',
      title: 'DIGITAL & CONTEÚDO',
      description: 'Sua marca precisa estar presente do jeito certo. Criamos e organizamos conteúdos para transformar redes sociais em canais de relacionamento, autoridade e negócios.',
      items: ['Gestão de redes sociais', 'Planejamento editorial', 'Criação de conteúdo', 'Copywriting', 'Roteiros', 'Calendário editorial', 'Design para redes sociais', 'Reels', 'Stories', 'Carrosséis', 'Conteúdo institucional', 'Conteúdo de autoridade']
    },
    midia: {
      number: '04 / TRÁFEGO PAGO & MÍDIA',
      title: 'TRÁFEGO PAGO & MÍDIA',
      description: 'Conteúdo chama atenção. Mídia coloca sua mensagem diante das pessoas certas. Planejamos e executamos campanhas focadas em alcance, reconhecimento, leads e conversão.',
      items: ['Meta Ads', 'Google Ads', 'Campanhas de reconhecimento', 'Geração de leads', 'Campanhas de conversão', 'Remarketing', 'Distribuição de conteúdo', 'Testes de criativos', 'Otimização de campanhas', 'Análise de resultados']
    },
    crm: {
      number: '05 / CRM & GERAÇÃO DE LEADS',
      title: 'CRM & GERAÇÃO DE LEADS',
      description: 'Não basta atrair pessoas. É preciso construir relacionamento. A RD7 ajuda marcas a transformar audiência em relacionamento e relacionamento em oportunidades.',
      items: ['Estratégia de captação de leads', 'Landing pages', 'Formulários', 'QR Codes', 'Captação via redes sociais', 'Organização de bases de contatos', 'CRM', 'Automação de relacionamento', 'Campanhas de reativação', 'Estratégias de conversão']
    },
    design: {
      number: '06 / DESIGN & IDENTIDADE',
      title: 'DESIGN & IDENTIDADE',
      description: 'Antes de alguém ouvir sua marca, já formou uma impressão. Criamos identidades e peças que traduzem posicionamentos e tornam a comunicação reconhecível.',
      items: ['Identidade visual', 'Logotipo', 'Branding', 'Direção de arte', 'Materiais institucionais', 'Artes para redes sociais', 'Apresentações', 'Campanhas', 'Banners', 'Materiais digitais e impressos']
    },
    imprensa: {
      number: '07 / ASSESSORIA DE IMPRENSA',
      title: 'ASSESSORIA DE IMPRENSA',
      description: 'Sua marca tem uma história. Ajudamos a colocá-la na imprensa por meio de estratégias de relacionamento, visibilidade, autoridade e reputação.',
      items: ['Assessoria de imprensa', 'Relacionamento com jornalistas', 'Produção de releases', 'Sugestão de pautas', 'Gestão de entrevistas', 'Media training', 'Posicionamento de porta-vozes', 'Monitoramento de mídia', 'Gestão de imagem', 'Comunicação institucional', 'Gestão de crises', 'Estratégias para geração de mídia espontânea']
    }
  };

  // Menu mobile com fechamento por clique, tecla Escape e mudança de viewport.
  const menuButton = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const header = $('.site-header');
  const setMenu = (open) => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.inert = !open;
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (event) => {
    if (menuButton?.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  // Navegação ativa, progresso de leitura e efeito sutil do cabeçalho.
  const progress = $('.scroll-progress');
  let scrollQueued = false;
  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
    header?.classList.toggle('is-scrolled', window.scrollY > 10);
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      window.requestAnimationFrame(updateScroll);
      scrollQueued = true;
    }
  }, {passive: true});
  window.addEventListener('resize', updateScroll, {passive: true});
  updateScroll();
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.desktop-nav .nav-link').forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-25% 0px -65% 0px'});
    $$('.section-anchor').forEach(section => activeObserver.observe(section));
  }

  // Transições acionadas apenas quando o conteúdo entra na tela.
  const reveals = $$('[data-reveal]');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    reveals.forEach(item => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08, rootMargin: '0px 0px 35px 0px'});
    reveals.forEach(item => observer.observe(item));
  }

  // Modal de serviços, contendo todos os itens do documento.
  const serviceDialog = $('#service-dialog');
  const dialogTitle = $('#dialog-title');
  const dialogDescription = $('#dialog-description');
  const dialogNumber = $('#dialog-number');
  const dialogList = $('#dialog-list');
  $$('.service-open').forEach(button => button.addEventListener('click', () => {
    const service = services[button.dataset.service];
    if (!service || !serviceDialog) return;
    dialogTitle.textContent = service.title;
    dialogDescription.textContent = service.description;
    dialogNumber.textContent = service.number;
    dialogList.replaceChildren(...service.items.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
    serviceDialog.showModal();
  }));
  $('.dialog-close')?.addEventListener('click', () => serviceDialog.close());
  $('.dialog-cta')?.addEventListener('click', () => serviceDialog.close());
  serviceDialog?.addEventListener('click', event => {
    if (event.target === serviceDialog) serviceDialog.close();
  });

  // Filtros de cases conceituais — nunca apresentam projetos simulados como clientes reais.
  const caseCards = $$('.case-card');
  const filterButtons = $$('.filter-button');
  const caseStatus = document.createElement('span');
  caseStatus.className = 'visually-hidden';
  caseStatus.setAttribute('role', 'status');
  $('.cases-filters')?.insertAdjacentElement('afterend', caseStatus);
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    caseCards.forEach(card => {
      const show = filter === 'todos' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visibleCount++;
    });
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    caseStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'proposta encontrada' : 'propostas encontradas'}.`;
  }));

  // Dados de contato: só links reais configurados pelo proprietário.
  const validWhatsapp = String(config.whatsapp || '').replace(/\D/g, '');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(config.email || '').trim()) ? String(config.email).trim() : '';
  const hasWhatsapp = validWhatsapp.length >= 11 && validWhatsapp.length <= 15;
  const socialContainer = $('#social-links');
  const socials = [
    ['INSTAGRAM', config.instagram], ['LINKEDIN', config.linkedin]
  ];
  if (hasWhatsapp) socials.push(['WHATSAPP', `https://wa.me/${validWhatsapp}`]);
  socials.forEach(([name, rawUrl]) => {
    if (!rawUrl) return;
    try {
      const parsed = new URL(rawUrl);
      if (!['https:', 'http:'].includes(parsed.protocol)) return;
      const anchor = document.createElement('a');
      anchor.href = parsed.toString();
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = name;
      socialContainer?.appendChild(anchor);
    } catch (_) { /* URL inválida: não mostrar link quebrado. */ }
  });

  // Formulário: nenhuma simulação de entrega. Abre canal real ou permite copiar.
  const form = $('#formulario');
  const formError = $('#form-error');
  const submitButton = $('#form-submit');
  const privacy = $('#form-privacy');
  const messageDialog = $('#message-dialog');
  const messagePreview = $('#message-preview');
  const copyStatus = $('#copy-status');
  let toastTimeout;
  const notify = (message) => {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 4200);
  };
  if (hasWhatsapp) {
    submitButton.firstChild.textContent = 'ENVIAR PELO WHATSAPP ';
    privacy.textContent = 'Ao clicar, você será levado ao WhatsApp para revisar e confirmar o envio. Nenhum dado é armazenado neste site.';
  } else if (validEmail) {
    submitButton.firstChild.textContent = 'ABRIR NO SEU E-MAIL ';
    privacy.textContent = 'O aplicativo de e-mail será aberto com a mensagem pronta; confirme o envio por lá. Nenhum dado é armazenado neste site.';
  }
  function makeMessage(data) {
    return [
      '*NOVO BRIEFING — SITE RD7*',
      '',
      `*Nome:* ${data.nome}`,
      `*Empresa / marca:* ${data.empresa || 'Não informada'}`,
      `*WhatsApp:* ${data.whatsapp}`,
      `*E-mail:* ${data.email}`,
      `*Serviço:* ${data.interesse}`,
      '',
      '*Sobre o projeto:*',
      data.mensagem
    ].join('\n');
  }
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const fields = $$('input,select,textarea', form);
    fields.forEach(field => field.classList.remove('field-invalid'));
    formError.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    const invalidField = fields.find(field => !field.checkValidity());
    if (invalidField) {
      invalidField.classList.add('field-invalid');
      invalidField.focus();
      invalidField.reportValidity();
      formError.textContent = 'Verifique os campos obrigatórios antes de continuar.';
      formError.hidden = false;
      return;
    }
    const whatsappDigits = String(data.whatsapp || '').replace(/\D/g, '');
    if (whatsappDigits.length < 10 || whatsappDigits.length > 13) {
      $('#whatsapp').classList.add('field-invalid');
      $('#whatsapp').focus();
      formError.textContent = 'Digite seu WhatsApp com DDD válido.';
      formError.hidden = false;
      return;
    }
    const message = makeMessage(data);
    if (hasWhatsapp) {
      const href = `https://wa.me/${validWhatsapp}?text=${encodeURIComponent(message)}`;
      window.location.assign(href);
    } else if (validEmail) {
      window.location.href = `mailto:${validEmail}?subject=${encodeURIComponent(`Novo briefing RD7 — ${data.nome}`)}&body=${encodeURIComponent(message.replaceAll('*', ''))}`;
    } else {
      messagePreview.value = message.replaceAll('*', '');
      copyStatus.textContent = '';
      messageDialog?.showModal();
    }
  });
  $('.message-close')?.addEventListener('click', () => messageDialog.close());
  messageDialog?.addEventListener('click', event => { if (event.target === messageDialog) messageDialog.close(); });
  $('#copy-message')?.addEventListener('click', async () => {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(messagePreview.value); copied = true; } catch (_) { /* fallback */ }
    }
    if (!copied) {
      messagePreview.focus();
      messagePreview.select();
      try { copied = document.execCommand('copy'); } catch (_) { /* fallback */ }
    }
    copyStatus.textContent = copied ? 'Mensagem copiada! Agora envie pelo seu canal de preferência.' : 'Selecione a mensagem e copie manualmente.';
    if (copied) notify('Mensagem do projeto copiada.');
  });

  $('#year').textContent = new Date().getFullYear();
})();
