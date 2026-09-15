import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, BarChart3, Bell, BookOpen, BriefcaseBusiness, Building2,
  Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, FileText,
  Headphones, Layers3, LockKeyhole, Menu, MessageCircle, Plus,
  Search, Send, ShieldCheck, Sparkles, Ticket, Users, X, Zap
} from 'lucide-react';
import './styles.css';

const faqItems = [
  ['Como acompanho meu chamado?', 'Acesse o painel do cliente pelo menu superior. Lá você vê o status, prazo estimado e o histórico da solicitação.'],
  ['Qual o prazo de resposta?', 'A resposta inicial costuma acontecer em até 1 dia útil para demandas prioritárias e em até 2 dias para solicitações normais.'],
  ['Posso anexar imagens ou documentos?', 'Sim. O cliente pode enviar arquivos, prints e documentos no formulário de abertura, respeitando o limite de 10 MB por anexo.'],
  ['Como registro uma reclamação?', 'Use a Central de Ouvidoria. Seu relato é tratado com sigilo e você recebe um protocolo para acompanhar a análise.']
];

const initialTickets = [
  {
    id: '#CH-2026-8841',
    title: 'Dúvida sobre segunda via de boleto',
    category: 'Financeiro',
    status: 'Aguardando sua resposta',
    date: 'Hoje, 10:42',
    priority: 'Média',
    messages: [
      { from: 'client', text: 'Olá, não encontrei a segunda via do boleto deste mês.', time: '10:42' },
      { from: 'agent', text: 'Olá, Marina! Já localizamos o seu contrato. Você pode confirmar os quatro últimos dígitos do CPF?', time: '11:08' }
    ]
  },
  {
    id: '#CH-2026-8798',
    title: 'Erro ao acessar o painel',
    category: 'Técnico',
    status: 'Em aberto',
    date: 'Ontem, 16:25',
    priority: 'Alta',
    messages: [
      { from: 'client', text: 'O painel fica carregando e não abre desde a manhã.', time: '16:25' },
      { from: 'agent', text: 'Recebemos seu relato e nossa equipe técnica já está investigando o acesso.', time: '16:41' }
    ]
  },
  {
    id: '#CH-2026-8520',
    title: 'Atualização cadastral concluída',
    category: 'Comercial',
    status: 'Resolvido',
    date: '12 jun, 09:14',
    priority: 'Baixa',
    messages: [
      { from: 'client', text: 'Preciso atualizar o endereço de cobrança.', time: '09:14' },
      { from: 'agent', text: 'Pronto! Seu endereço foi atualizado com sucesso. Podemos ajudar em algo mais?', time: '09:37' }
    ]
  }
];

const demoProfiles = [
  { id: 'marina', name: 'Marina Costa', email: 'marina.costa@atendeplus.com', password: 'senha123', initials: 'MC', role: 'cliente', company: 'NovaTech' },
  { id: 'ana', name: 'Ana Ribeiro', email: 'ana.ribeiro@atendeplus.com', password: 'atendente123', initials: 'AR', role: 'atendente', company: 'Atende+' }
];

const navItems = [
  { id: 'home', label: 'Início', icon: Headphones, roles: ['cliente', 'atendente'] },
  { id: 'ticket', label: 'Abrir chamado', icon: Plus, roles: ['cliente'] },
  { id: 'dashboard', label: 'Dashboard', icon: FileText, roles: ['cliente', 'atendente'] },
  { id: 'knowledge', label: 'Base de conhecimento', icon: BookOpen, roles: ['cliente', 'atendente'] },
  { id: 'queue', label: 'Fila de chamados', icon: Layers3, roles: ['atendente'] },
  { id: 'clients', label: 'Clientes', icon: Users, roles: ['atendente'] }
];

const moduleCards = [
  { title: 'Portal do cliente', description: 'Abertura de chamados, histórico e rastreio em tempo real.', icon: MessageCircle, tone: 'blue' },
  { title: 'Área do atendente', description: 'Resposta e atualização do status do atendimento com prioridade.', icon: Users, tone: 'cyan' },
  { title: 'Central de ouvidoria', description: 'Recebimento de denúncias e reclamações com tratamento confidencial.', icon: ShieldCheck, tone: 'amber' },
  { title: 'Base de conhecimento', description: 'FAQ, tutoriais e materiais para autoatendimento.', icon: BookOpen, tone: 'violet' }
];

const metricsData = [
  { label: 'Tempo médio de resposta', value: '1h 42m', delta: '+18%', tone: 'cyan' },
  { label: 'Volume por categoria', value: '248', delta: '24 novos', tone: 'blue' },
  { label: 'Taxa de resolução', value: '87%', delta: '+6%', tone: 'green' },
  { label: 'Chamados em atraso', value: '12', delta: '-8%', tone: 'amber' },
  { label: 'Satisfação do cliente', value: '4,8/5', delta: '+0,3', tone: 'violet' }
];

function App() {
  const [page, setPage] = useState('home');
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toast, setToast] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [session, setSession] = useState(null);

  const currentUser = session || demoProfiles[0];
  const visibleNav = navItems.filter((item) => item.roles.includes(currentUser.role));

  const navigate = (nextPage) => {
    setPage(nextPage);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  const createTicket = (ticket) => {
    setTickets((current) => [ticket, ...current]);
    notify('Chamado aberto com sucesso.');
  };

  const deleteTicket = (ticketId) => {
    setTickets((current) => current.filter((ticket) => ticket.id !== ticketId));
    setSelectedTicket((current) => (current && current.id === ticketId ? null : current));
    notify('Chamado removido com sucesso.');
  };

  const handleLogout = () => {
    setSession(null);
    setSelectedTicket(null);
    setPage('home');
    notify('Você saiu dos perfis.');
  };

  if (!session) {
    return <LandingScreen onLogin={setSession} notify={notify} />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label="Voltar para o início">
            <span className="brand-mark"><Zap size={18} fill="currentColor" /></span>
            <span>atende<span className="brand-accent">+</span></span>
          </button>

          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu" aria-expanded={mobileMenu}>
            <Menu size={21} />
          </button>

          <nav className={`main-nav ${mobileMenu ? 'is-open' : ''}`} aria-label="Navegação principal">
            {visibleNav.map(({ id, label, icon: Icon }) => (
              <button key={id} className={page === id ? 'active' : ''} onClick={() => navigate(id)}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button className="notification-button" aria-label="Notificações">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <span className="user-avatar">{currentUser.initials}</span>
            <span className="user-name">{currentUser.name}</span>
            <button className="logout-button" onClick={handleLogout}>Sair dos perfis</button>
          </div>
        </div>
      </header>

      <main>
        {page === 'home' && <HomePage navigate={navigate} notify={notify} role={currentUser.role} />}
        {page === 'ticket' && <TicketPage onCreate={createTicket} navigate={navigate} />}
        {page === 'ombudsman' && <OmbudsmanPage notify={notify} navigate={navigate} />}
        {page === 'dashboard' && <DashboardPage tickets={tickets} currentUser={currentUser} setSelectedTicket={setSelectedTicket} navigate={navigate} onDeleteTicket={deleteTicket} />}
        {page === 'queue' && <QueuePage tickets={tickets} currentUser={currentUser} setSelectedTicket={setSelectedTicket} />}
        {page === 'clients' && <ClientsPage tickets={tickets} currentUser={currentUser} />}
        {page === 'knowledge' && <KnowledgePage role={currentUser.role} />}
      </main>

      {selectedTicket && <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} notify={notify} />}

      {toast && (
        <div className={`toast ${toast.type}`} role="status">
          <CheckCircle2 size={19} />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} aria-label="Fechar notificação"><X size={16} /></button>
        </div>
      )}
    </div>
  );
}

function LandingScreen({ onLogin, notify }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    window.setTimeout(() => {
      const user = demoProfiles.find(
        (profile) => profile.email.toLowerCase() === email.trim().toLowerCase() && profile.password === password
      );

      if (!user) {
        setError('E-mail ou senha inválidos. Use um dos perfis de demonstração.');
        setLoading(false);
        return;
      }

      onLogin(user);
      notify('Login realizado com sucesso.');
    }, 500);
  };

  const scrollToLogin = () => {
    document.getElementById('login')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const features = [
    { title: 'Chamados', text: 'Abra e acompanhe solicitações com clareza e rapidez.', icon: Ticket },
    { title: 'Atendimento', text: 'Converse com a equipe pelo próprio chamado e acompanhe cada etapa.', icon: MessageCircle },
    { title: 'Ouvidoria', text: 'Registre reclamações e denúncias com sigilo e acompanhamento.', icon: ShieldCheck },
    { title: 'Conhecimento', text: 'Encontre respostas sem precisar abrir um chamado novo.', icon: BookOpen }
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="brand-wrap">
            <span className="brand-mark large"><Zap size={22} fill="currentColor" /></span>
            <span className="brand-name">atende<span className="brand-accent">+</span></span>
          </div>

          <button className="primary-button" onClick={scrollToLogin}>Entrar na plataforma</button>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <div className="landing-copy">
              <span className="eyebrow light">CENTRAL DE ATENDIMENTO</span>
              <h1>Centralize seus atendimentos em um só lugar.</h1>
              <p>Abra chamados, acompanhe solicitações e encontre respostas de forma simples e organizada.</p>

              <div className="landing-actions">
                <button className="primary-button" onClick={scrollToLogin}>Entrar na plataforma</button>
                <button className="outline-button light" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Ver funcionalidades</button>
              </div>
            </div>

            <div className="landing-showcase">
              <div className="showcase-card main">
                <span className="mini-label">Solicite</span>
                <h3>Problema com acesso</h3>
                <p>Chamado aberto em poucos passos.</p>
              </div>
              <div className="showcase-card secondary">
                <span className="mini-label">Acompanhe</span>
                <strong>#1024</strong>
                <small>Em atendimento</small>
              </div>
              <div className="showcase-card tertiary">
                <span className="mini-label">Resolva</span>
                <strong>Resposta em 1 dia</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="landing-features">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">FUNCIONALIDADES</span>
              <h2>Uma experiência simples para cada tipo de usuário</h2>
            </div>
          </div>

          <div className="landing-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="landing-feature-card">
                  <div className="feature-icon"><Icon size={18} /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-flow">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">FLUXO</span>
              <h2>Solicite. Acompanhe. Resolva.</h2>
            </div>
          </div>

          <div className="flow-steps">
            <div className="flow-step">
              <span>01</span>
              <strong>Solicite</strong>
              <p>Envie sua demanda com categoria, assunto e descrição.</p>
            </div>
            <div className="flow-step">
              <span>02</span>
              <strong>Acompanhe</strong>
              <p>Veja o status da sua solicitação em poucos cliques.</p>
            </div>
            <div className="flow-step">
              <span>03</span>
              <strong>Resolva</strong>
              <p>Receba respostas, atualizações e conclusões do atendimento.</p>
            </div>
          </div>
        </section>

        <section id="login" className="landing-login-panel">
          <div className="landing-login-shell">
            <div className="landing-login-copy">
              <span className="eyebrow">ACESSO</span>
              <h2>Entrar na plataforma</h2>
              <p>Escolha um perfil de demonstração e veja a experiência adaptada ao tipo de usuário.</p>

              <div className="demo-card-list">
                {demoProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    className="demo-profile-card"
                    onClick={() => {
                      setEmail(profile.email);
                      setPassword(profile.password);
                    }}
                  >
                    <span className="demo-avatar">{profile.initials}</span>
                    <span>
                      <strong>{profile.name}</strong>
                      <small>{profile.role}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="login-panel login-form-panel compact-panel">
              <form onSubmit={handleSubmit} className="login-form">
                <label className="field login-field">
                  <span>E-mail</span>
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" required />
                </label>

                <label className="field login-field">
                  <span>Senha</span>
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha" required />
                </label>

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="primary-button full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>

                <button type="button" className="text-button center" onClick={() => { setEmail(''); setPassword(''); setError(''); }}>
                  Sair dos perfis
                </button>
              </form>

              <div className="demo-credentials">
                <strong>Perfis de demonstração</strong>
                <ul>
                  <li><span>Cliente</span><code>marina.costa@atendeplus.com / senha123</code></li>
                  <li><span>Atendente</span><code>ana.ribeiro@atendeplus.com / atendente123</code></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            <span className="brand-mark large"><Zap size={20} fill="currentColor" /></span>
            <span className="brand-name">atende<span className="brand-accent">+</span></span>
          </div>

          <div className="footer-links">
            <span>Atendimento</span>
            <span>Ouvidoria</span>
            <span>Base de conhecimento</span>
          </div>

          <span className="footer-copy">© 2026 Atende+</span>
        </div>
      </footer>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function HomePage({ navigate, notify, role }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [search, setSearch] = useState('');
  const [contactOpen, setContactOpen] = useState(false);

  const quickActions = role === 'atendente'
    ? [
        { title: 'Fila de chamados', description: 'Veja chamados pendentes, em atendimento e prioritários.', action: 'Ver fila', icon: Layers3, tone: 'blue', onClick: () => navigate('queue'), keywords: 'fila chamados pendentes prioridade atendimento' },
        { title: 'Clientes', description: 'Busque o cliente e acompanhe o histórico de solicitações.', action: 'Consultar clientes', icon: Users, tone: 'green', onClick: () => navigate('clients'), keywords: 'clientes histórico solicitações atendimento' },
        { title: 'Base de conhecimento', description: 'Consulte materiais de apoio para responder com rapidez.', action: 'Abrir base', icon: BookOpen, tone: 'violet', onClick: () => navigate('knowledge'), keywords: 'faq artigo base conhecimento procedimento' },
        { title: 'Ouvidoria', description: 'Acompanhe manifestações sigilosas e reclamações recebidas.', action: 'Ver ouvidoria', icon: ShieldCheck, tone: 'amber', onClick: () => navigate('ombudsman'), keywords: 'reclamação ouvidoria sigilo manifestação' }
      ]
    : [
        { title: 'Abrir chamado', description: 'Relate um problema técnico ou solicite suporte especializado.', action: 'Criar chamado', icon: Ticket, tone: 'green', onClick: () => navigate('ticket'), keywords: 'ticket suporte técnico problema erro login acesso ajuda chamado' },
        { title: 'Meus chamados', description: 'Acompanhe o status de cada solicitação do seu cliente.', action: 'Ver meus chamados', icon: FileText, tone: 'blue', onClick: () => navigate('dashboard'), keywords: 'meus chamados status histórico atualizações' },
        { title: 'Ajuda e FAQ', description: 'Consulte respostas rápidas e orientações para dúvidas comuns.', action: 'Abrir ajuda', icon: CircleHelp, tone: 'violet', onClick: () => setContactOpen(true), keywords: 'faq ajuda dúvidas orientações' },
        { title: 'Central de reclamações', description: 'Registre uma reclamação ou denúncia com sigilo.', action: 'Ir para ouvidoria', icon: ShieldCheck, tone: 'amber', onClick: () => navigate('ombudsman'), keywords: 'reclamação ouvidoria manifestação insatisfação problema sigilo denúncia' }
      ];

  const moduleRoles = {
    cliente: ['Portal do cliente', 'Central de ouvidoria', 'Base de conhecimento'],
    atendente: ['Área do atendente', 'Base de conhecimento', 'Central de ouvidoria']
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredQuickActions = normalizedSearch
    ? quickActions.filter((item) => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(normalizedSearch))
    : quickActions;

  const filteredFaq = normalizedSearch
    ? faqItems.filter(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(normalizedSearch))
    : faqItems;

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!normalizedSearch) return;

    const actionMatch = quickActions.find((item) => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(normalizedSearch));
    if (actionMatch) {
      actionMatch.onClick();
      return;
    }

    const faqMatch = faqItems.find(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(normalizedSearch));
    if (faqMatch) {
      const index = faqItems.findIndex(([itemQuestion]) => itemQuestion === faqMatch[0]);
      setOpenFaq(index);
    }
  };

  return (
    <>
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow light">CENTRAL DE ATENDIMENTO</span>
            <h1>
              Como podemos<br />
              <em>ajudar você</em> hoje?
            </h1>
            <p>
              Acompanhe solicitações, receba suporte técnico, registre reclamações e tenha uma experiência mais clara e organizada.
            </p>

            <form className="search-box" onSubmit={handleSearchSubmit}>
              <Search size={20} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busque por uma dúvida ou assunto..." aria-label="Buscar na central de ajuda" />
              <button type="submit" className="search-submit" aria-label="Buscar">Buscar</button>
            </form>

            <div className="popular-searches">
              <span>Mais buscados:</span>
              <button onClick={() => setSearch('segundavia')}>segunda via</button>
              <button onClick={() => setSearch('prazo')}>prazo</button>
              <button onClick={() => setSearch('acesso')}>acesso</button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-stat">
              <span className="stat-icon"><Clock3 size={18} /></span>
              <div>
                <strong>&lt; 2h</strong>
                <span>tempo médio de resposta</span>
              </div>
            </div>
            <div className="hero-sticker"><Sparkles size={16} /> Atendendo com rapidez</div>
            <MessageCircle className="hero-message-icon" size={112} strokeWidth={1.2} />
          </div>
        </div>
      </section>

      {normalizedSearch && (
        <section className="content-section search-results-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">RESULTADOS DA BUSCA</span>
              <h2>Encontramos {filteredQuickActions.length + filteredFaq.length} itens para “{search}”</h2>
            </div>
          </div>

          {filteredQuickActions.length === 0 && filteredFaq.length === 0 ? (
            <div className="empty-search">
              <CircleHelp size={18} />
              <p>Nenhum resultado encontrado. Tente outra palavra-chave como “suporte”, “reclamação”, “acesso” ou “prazo”.</p>
            </div>
          ) : (
            <div className="search-result-grid">
              {filteredQuickActions.map((item) => (
                <button key={item.title} className="search-result-item" onClick={item.onClick} type="button">
                  <span className={`quick-icon ${item.tone}`}><item.icon size={18} /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </div>
                </button>
              ))}

              {filteredFaq.map(([question, answer]) => (
                <button key={question} className="search-result-item faq-result" type="button" onClick={() => setOpenFaq(faqItems.findIndex(([itemQuestion]) => itemQuestion === question))}>
                  <span className="faq-search-tag">FAQ</span>
                  <div>
                    <strong>{question}</strong>
                    <small>{answer}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="content-section quick-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">RESOLVA DO SEU JEITO</span>
            <h2>Por onde começamos?</h2>
          </div>
          <span className="section-note"><LockKeyhole size={15} /> Atendimento seguro e humanizado</span>
        </div>

        <div className="quick-grid">
          {filteredQuickActions.map((item) => (
            <QuickCard key={item.title} icon={item.icon} tone={item.tone} title={item.title} text={item.description} action={item.action} onClick={item.onClick} />
          ))}
        </div>
      </section>

      {role === 'atendente' && (
        <section className="content-section metrics-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">INDICADORES</span>
              <h2>Visão operacional do atendimento</h2>
            </div>
          </div>

          <div className="metrics-grid">
            {metricsData.map((metric) => (
              <div key={metric.label} className="metric-card">
                <span className={`metric-pill ${metric.tone}`}>{metric.delta}</span>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="content-section faq-section">
        <div className="faq-layout">
          <div className="faq-aside">
            <span className="eyebrow">AINDA COM DÚVIDAS?</span>
            <h2>Respostas para as perguntas mais comuns.</h2>
            <p>Se não encontrar o que precisa, nosso time está a um clique de distância.</p>
            <button className="text-button" onClick={() => setContactOpen(true)}>
              Falar com atendimento <ArrowRight size={16} />
            </button>
          </div>

          <div className="faq-list">
            {filteredFaq.map(([question, answer], index) => (
              <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={question}>
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                  <span>{question}</span>
                  <ChevronDown size={18} />
                </button>
                {openFaq === index && <p>{answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} notify={notify} />}
    </>
  );
}

function QuickCard({ icon: Icon, tone, title, text, action, onClick }) {
  return (
    <article className="quick-card">
      <div className={`quick-icon ${tone}`}><Icon size={21} /></div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="card-action" onClick={onClick}>
        {action}
        <ArrowRight size={15} />
      </button>
    </article>
  );
}

function ContactModal({ onClose, notify }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
      notify('Mensagem enviada. Em breve falaremos com você.');
    }, 800);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal contact-modal">
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={19} /></button>

        {sent ? (
          <SuccessState
            title="Mensagem recebida!"
            text="Nossa equipe vai entrar em contato com você em breve."
            action="Voltar para o início"
            onAction={onClose}
          />
        ) : (
          <>
            <span className="eyebrow">PRIMEIRO CONTATO</span>
            <h2>Fale com a gente</h2>
            <p className="modal-lead">Conte o que você precisa e encontraremos o melhor caminho.</p>

            <form onSubmit={submit}>
              <div className="form-row">
                <Field label="Nome" required placeholder="Seu nome completo" />
                <Field label="E-mail" required type="email" placeholder="voce@email.com" />
              </div>

              <div className="form-row">
                <Field label="Telefone" placeholder="(00) 00000-0000" />
                <Field label="Assunto" required placeholder="Como podemos ajudar?" />
              </div>

              <Field label="Mensagem" required textarea placeholder="Escreva sua mensagem..." />

              <button className="primary-button full" disabled={loading}>
                {loading ? 'Enviando...' : <><Send size={16} /> Enviar mensagem</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function TicketPage({ onCreate, navigate }) {
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      const id = `#CH-2026-${Math.floor(1000 + Math.random() * 8999)}`;
      onCreate({
        id,
        title: event.target.title.value,
        category: event.target.category.value,
        status: 'Em aberto',
        date: 'Agora',
        priority: event.target.priority.value,
        messages: [{ from: 'client', text: event.target.description.value, time: 'Agora' }]
      });

      setSubmitted(id);
      setLoading(false);
    }, 900);
  };

  if (submitted) {
    return (
      <div className="page-wrap narrow">
        <SuccessState
          eyebrow="CHAMADO REGISTRADO"
          title="Tudo certo por aqui."
          text={<>Seu chamado foi aberto com o protocolo <strong>{submitted}</strong>. A primeira resposta chega em até 1 dia útil.</>}
          action="Acompanhar chamado"
          onAction={() => navigate('dashboard')}
          secondary="Abrir outro chamado"
          onSecondary={() => setSubmitted(null)}
        />
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <PageIntro
        eyebrow="SUPORTE E DÚVIDAS"
        title="Abra um chamado"
        description="Descreva o que está acontecendo. Quanto mais detalhes, mais rápido conseguimos ajudar."
      >
        <div className="response-pill">
          <Clock3 size={17} />
          <span>
            <strong>Resposta em até 1 dia útil</strong>
            <small>Para prioridades baixa a alta</small>
          </span>
        </div>
      </PageIntro>

      <form className="form-panel" onSubmit={submit}>
        <div className="form-panel-header">
          <div>
            <span className="step-label">PASSO 01 / 01</span>
            <h2>Detalhes da solicitação</h2>
          </div>
          <span className="required-note">* Campos obrigatórios</span>
        </div>

        <div className="form-row">
          <SelectField name="category" label="Categoria" required options={['Financeiro', 'Técnico', 'Comercial', 'Logística']} />
          <SelectField name="priority" label="Prioridade" required options={['Baixa', 'Média', 'Alta', 'Crítica']} />
        </div>

        <Field name="title" label="Título do chamado" required placeholder="Ex: Não consigo acessar minha conta" />
        <Field name="description" label="Descreva o problema" required textarea placeholder="Conte com o máximo de detalhes possível..." />

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Registrando...' : <><Send size={16} /> Registrar chamado</>}
          </button>
          <button type="button" className="text-button" onClick={() => navigate('home')}>Voltar para o início</button>
        </div>
      </form>
    </div>
  );
}

function OmbudsmanPage({ notify, navigate }) {
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setLoading(true);

    window.setTimeout(() => {
      const id = `#OUV-2026-${Math.floor(1000 + Math.random() * 8999)}`;
      setSubmitted(id);
      setLoading(false);
      notify('Sua manifestação foi registrada com sigilo.');
    }, 900);
  };

  if (submitted) {
    return (
      <div className="page-wrap narrow">
        <SuccessState
          eyebrow="OUVIDORIA · EM ANÁLISE"
          title="Obrigado por nos contar."
          text={<>Sua manifestação recebeu o protocolo <strong>{submitted}</strong>. Ela será analisada com cuidado e transparência.</>}
          action="Ir para o início"
          onAction={() => navigate('home')}
        />
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <PageIntro
        eyebrow="ESCUTA E TRANSPARÊNCIA"
        title="Sua voz transforma."
        description="Sentimos muito quando sua experiência não corresponde ao que você esperava. Estamos aqui para ouvir, investigar e melhorar."
      >
        <div className="confidential-note">
          <ShieldCheck size={18} />
          <span>
            <strong>Relato confidencial</strong>
            <small>Tratamento ético e sigiloso</small>
          </span>
        </div>
      </PageIntro>

      <form className="form-panel ombudsman-panel" onSubmit={submit}>
        <div className="form-panel-header">
          <div>
            <span className="step-label">MANIFESTAÇÃO</span>
            <h2>Conte o que aconteceu</h2>
          </div>
          <span className="required-note">* Campos obrigatórios</span>
        </div>

        <div className="form-row">
          <Field label="Pedido ou contrato" placeholder="Opcional" />
          <SelectField label="Classificação" required options={['Atraso na entrega', 'Atendimento inadequado', 'Falha no produto', 'Cobrança indevida', 'Outro']} />
        </div>

        <Field label="Descreva detalhadamente o ocorrido" required textarea placeholder="Estamos ouvindo. Compartilhe datas, pessoas envolvidas e tudo que considerar importante..." />
        <Field label="O que você espera como solução?" required textarea placeholder="Como podemos reparar ou melhorar essa experiência?" />

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Registrando...' : <><ShieldCheck size={16} /> Enviar manifestação</>}
          </button>
          <button type="button" className="text-button" onClick={() => navigate('home')}>Voltar para o início</button>
        </div>
      </form>
    </div>
  );
}

function DashboardPage({ tickets, currentUser, setSelectedTicket, navigate, onDeleteTicket }) {
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Em aberto', 'Aguardando sua resposta', 'Resolvido'];
  const filtered = filter === 'Todos' ? tickets : tickets.filter((ticket) => ticket.status === filter);

  const roleLabel = {
    cliente: 'Área do cliente',
    atendente: 'Área do atendente'
  };

  const isClient = currentUser.role === 'cliente';
  const summary = {
    open: tickets.filter((ticket) => ticket.status !== 'Resolvido').length,
    inProgress: tickets.filter((ticket) => ticket.status === 'Em aberto' || ticket.status.includes('Aguardando') || ticket.status === 'Em atendimento').length,
    resolved: tickets.filter((ticket) => ticket.status === 'Resolvido').length
  };

  const emptyState = isClient && filtered.length === 0;

  return (
    <div className="page-wrap dashboard">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">{roleLabel[currentUser.role]}</span>
          <h1>{isClient ? `Olá, ${currentUser.name.split(' ')[0]}` : `Painel de atendimento`} <span className="wave">✦</span></h1>
          <p>
            {isClient
              ? 'Acompanhe os seus chamados, veja o status atual e aproveite a comunicação direta com o suporte.'
              : 'Monitorize a fila, acompanhe prioridades e mantenha o atendimento organizado.'}
          </p>
        </div>
        {isClient ? (
          <button className="outline-button" onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-ticket'))}><ArrowRight size={15} /> Abrir chamado</button>
        ) : (
          <button className="outline-button"><ArrowRight size={15} /> Exportar fila</button>
        )}
      </div>

      <div className="dashboard-summary">
        <div>
          <span className="summary-number">{isClient ? summary.open : tickets.length}</span>
          <span>{isClient ? 'Chamados abertos' : 'Pendentes'}</span>
        </div>
        <div>
          <span className="summary-number blue-number">{summary.inProgress}</span>
          <span>{isClient ? 'Em atendimento' : 'Em atendimento'}</span>
        </div>
        <div>
          <span className="summary-number green-number">{summary.resolved}</span>
          <span>Resolvidos</span>
        </div>
      </div>

      <div className="list-heading">
        <div>
          <h2>{isClient ? 'Meus chamados' : 'Fila de chamados'}</h2>
          <span className="list-count">{filtered.length} solicitações</span>
        </div>

        {!isClient && (
          <div className="filter-tabs">
            {filters.map((item) => (
              <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {emptyState ? (
        <div className="empty-client-panel">
          <div className="empty-client-image" aria-hidden="true" />
          <h3>Você ainda não abriu nenhum chamado.</h3>
          <p>Quando precisar, estamos aqui para ajudar.</p>
          <button className="primary-button" onClick={() => navigate('ticket')}>Abrir chamado</button>
        </div>
      ) : (
        <div className="ticket-list">
          {filtered.map((ticket) => (
            <div className="ticket-row" key={ticket.id}>
              <button className="ticket-main-button" onClick={() => setSelectedTicket(ticket)}>
                <span className={`ticket-icon ${ticket.status === 'Resolvido' ? 'resolved' : ticket.status.includes('Aguardando') ? 'waiting' : ''}`}>
                  <Ticket size={19} />
                </span>

                <span className="ticket-main">
                  <strong>{ticket.title}</strong>
                  <span>{ticket.id} <i /> {ticket.category}</span>
                </span>

                <span className={`status-badge ${ticket.status === 'Resolvido' ? 'resolved' : ticket.status.includes('Aguardando') ? 'waiting' : 'open'}`}>
                  <span />
                  {ticket.status}
                </span>

                <span className="ticket-date">{ticket.date}</span>
                <span className="row-arrow"><ArrowRight size={16} /></span>
              </button>

              {onDeleteTicket && (
                <button className="delete-ticket-button" onClick={() => onDeleteTicket(ticket.id)} aria-label={`Excluir chamado ${ticket.id}`}>
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QueuePage({ tickets, currentUser, setSelectedTicket }) {
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Em aberto', 'Aguardando sua resposta', 'Resolvido'];
  const filtered = filter === 'Todos' ? tickets : tickets.filter((ticket) => ticket.status === filter);

  return (
    <div className="page-wrap dashboard">
      <PageIntro
        eyebrow="OPERACIONAL"
        title="Fila de chamados"
        description="Visualize a demanda em andamento, priorize atendimentos e acompanhe o estado dos chamados.
"
      >
        <div className="response-pill">
          <Users size={17} />
          <span>
            <strong>{tickets.length} registros</strong>
            <small>Visão operacional da equipe</small>
          </span>
        </div>
      </PageIntro>

      <div className="list-heading">
        <div>
          <h2>Chamados disponíveis</h2>
          <span className="list-count">{filtered.length} solicitações</span>
        </div>

        <div className="filter-tabs">
          {filters.map((item) => (
            <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="ticket-list">
        {filtered.map((ticket) => (
          <button className="ticket-row" key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
            <span className={`ticket-icon ${ticket.status === 'Resolvido' ? 'resolved' : ticket.status.includes('Aguardando') ? 'waiting' : ''}`}>
              <Ticket size={19} />
            </span>

            <span className="ticket-main">
              <strong>{ticket.title}</strong>
              <span>{ticket.id} <i /> {ticket.category} · Cliente: {currentUser.name.split(' ')[0]}</span>
            </span>

            <span className={`status-badge ${ticket.status === 'Resolvido' ? 'resolved' : ticket.status.includes('Aguardando') ? 'waiting' : 'open'}`}>
              <span />
              {ticket.status}
            </span>

            <span className="ticket-date">{ticket.date}</span>
            <span className="row-arrow"><ArrowRight size={16} /></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ClientsPage({ tickets, currentUser }) {
  const clients = [
    { name: 'Marina Costa', tickets: tickets.length, lastContact: 'Hoje, 10:42', status: 'Em atendimento' },
    { name: 'Ana Ribeiro', tickets: 2, lastContact: 'Ontem, 18:05', status: 'Aguardando resposta' }
  ];

  return (
    <div className="page-wrap dashboard">
      <PageIntro
        eyebrow="CLIENTES"
        title="Atendimento por cliente"
        description="Busque, identifique e acompanhe o histórico de cada pessoa que abriu solicitações."
      >
        <div className="response-pill">
          <Users size={17} />
          <span>
            <strong>{clients.length} clientes</strong>
            <small>Com histórico de atendimento</small>
          </span>
        </div>
      </PageIntro>

      <div className="ticket-list">
        {clients.map((client) => (
          <div className="ticket-row" key={client.name}>
            <span className="ticket-icon resolved"><Users size={19} /></span>
            <span className="ticket-main">
              <strong>{client.name}</strong>
              <span>{client.tickets} chamados · Último contato: {client.lastContact}</span>
            </span>
            <span className="status-badge open"><span />{client.status}</span>
            <span className="ticket-date">Histórico</span>
            <span className="row-arrow"><ArrowRight size={16} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgePage({ role }) {
  const articles = [
    {
      title: 'Como abrir um chamado corretamente',
      summary: 'Descreva o problema, informe prazo e anexe imagens para reduzir tempo de resposta.',
      icon: MessageCircle,
      content: [
        'Para abrir um chamado de forma eficiente, descreva com clareza o problema, o impacto que ele traz e qualquer detalhe relevante, como erro, horário e mensagens anteriores.',
        'Inclua categoria, prioridade e dados importantes, como e-mails, contratos ou telas afetadas. Quando possível, envie prints ou vídeos curtos para facilitar a análise inicial.',
        'Depois de enviar, você pode acompanhar o status no painel e responder diretamente pelo histórico do chamado.'
      ]
    },
    {
      title: 'Checklist de atendimento',
      summary: 'Informe categoria, prioridade e impactos para que o time entenda a urgência.',
      icon: Layers3,
      content: [
        'Antes de enviar o chamado, confirme se o problema já foi identificado e se você sabe qual área é responsável por ele.',
        'Mantenha o texto objetivo: o que aconteceu, quando começou, em que ambiente ocorreu e qual é o efeito para o usuário ou empresa.',
        'A prioridade deve refletir a urgência real. Isso ajuda o time a organizar a fila e responder no tempo certo.'
      ]
    },
    {
      title: 'Soluções mais comuns',
      summary: 'Confira respostas frequentes para dúvidas sobre acesso, faturamento e documentos.',
      icon: ShieldCheck,
      content: [
        'Se o problema for de acesso, vale verificar login, senha, navegador e permissões antes de abrir um novo chamado.',
        'Em questões de faturamento, confirme dados do contrato, vencimento e documento solicitado antes de responder ao atendimento.',
        'Para documentos e arquivos, mantenha o nome, tipo e extensão no texto para acelerar a análise da solicitação.'
      ]
    },
    {
      title: 'Política de ouvidoria',
      summary: 'Saiba como o canal de reclamações é tratado com sigilo e transparência.',
      icon: LockKeyhole,
      content: [
        'A ouvidoria deve ser usada para registrar falhas na experiência, falta de atendimento e situações que precisam de análise mais sensível.',
        'Quando a manifestação for sigilosa, o sistema pode ocultar dados que não são essenciais para o atendimento e manter o encaminhamento adequado.',
        'Cada relato recebe protocolo para acompanhamento e pode ser revisado com atenção, discrição e transparência.'
      ]
    }
  ];

  const [selectedArticle, setSelectedArticle] = useState(articles[0]);

  return (
    <div className="page-wrap knowledge-page">
      <PageIntro
        eyebrow={role === 'atendente' ? 'SUPORTE OPERACIONAL' : 'BASE DE CONHECIMENTO'}
        title={role === 'atendente' ? 'Artigos e respostas rápidas' : 'Central de autoatendimento'}
        description={role === 'atendente' ? 'Consulte materiais úteis para orientar o atendimento com agilidade e consistência.' : 'Organize dúvidas, procedimentos e boas práticas para reduzir o volume de contatos e acelerar o suporte.'}
      >
        <div className="response-pill">
          <BookOpen size={17} />
          <span>
            <strong>{role === 'atendente' ? 'Apoio ao atendimento' : 'Autoatendimento'}</strong>
            <small>{role === 'atendente' ? 'Conteúdos para responder com segurança' : 'Conteúdos sempre disponíveis'}</small>
          </span>
        </div>
      </PageIntro>

      <div className="knowledge-layout">
        <div className="knowledge-grid">
          {articles.map(({ title, summary, icon: Icon }) => (
            <article key={title} className={`knowledge-card ${selectedArticle.title === title ? 'selected' : ''}`}>
              <span className="knowledge-icon"><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{summary}</p>
              <button className="text-button" onClick={() => setSelectedArticle(articles.find((article) => article.title === title))}>
                Ler artigo <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>

        <div className="knowledge-article-detail">
          <span className="eyebrow">ARTIGO SELECIONADO</span>
          <h3>{selectedArticle.title}</h3>
          {selectedArticle.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketModal({ ticket, onClose, notify }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(ticket.messages);

  const send = (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    setMessages((current) => [...current, { from: 'client', text: message, time: 'Agora' }]);
    setMessage('');
    notify('Resposta enviada ao atendente.');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal ticket-modal">
        <div className="ticket-modal-head">
          <div>
            <span className="eyebrow">{ticket.id}</span>
            <h2>{ticket.title}</h2>
            <span className={`status-badge ${ticket.status === 'Resolvido' ? 'resolved' : 'open'}`}>
              <span />
              {ticket.status}
            </span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={19} /></button>
        </div>

        <div className="conversation">
          {messages.map((item, index) => (
            <div className={`message ${item.from}`} key={`${item.time}-${index}`}>
              <span className="message-avatar">{item.from === 'agent' ? 'AT' : 'MC'}</span>
              <div>
                <div className="message-meta">
                  <strong>{item.from === 'agent' ? 'Atende+ · Ana' : 'Você'}</strong>
                  <span>{item.time}</span>
                </div>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="reply-box" onSubmit={send}>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escreva uma resposta..." aria-label="Nova resposta" />
          <button className="send-button" aria-label="Enviar resposta"><Send size={17} /></button>
        </form>
      </div>
    </div>
  );
}

function SuccessState({ eyebrow, title, text, action, onAction, secondary, onSecondary }) {
  return (
    <div className="success-state">
      <div className="success-check"><Check size={30} /></div>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      <p>{text}</p>
      <button className="primary-button" onClick={onAction}>{action}<ArrowRight size={16} /></button>
      {secondary && <button className="text-button center" onClick={onSecondary}>{secondary}</button>}
    </div>
  );
}

function Field({ label, name, required, placeholder, type = 'text', textarea = false }) {
  return (
    <label className="field">
      <span>{label}{required && <b>*</b>}</span>
      {textarea ? (
        <textarea name={name} required={required} placeholder={placeholder} rows="5" />
      ) : (
        <input name={name} required={required} type={type} placeholder={placeholder} />
      )}
    </label>
  );
}

function SelectField({ label, name, required, options }) {
  return (
    <label className="field">
      <span>{label}{required && <b>*</b>}</span>
      <select name={name} required={required} defaultValue="">
        <option value="" disabled>Selecione uma opção</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

createRoot(document.getElementById('root')).render(<App />);
