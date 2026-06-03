import clsx from 'clsx';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { motion } from 'framer-motion';
import {
  Baby,
  BookOpen,
  Camera,
  Eye,
  Gauge,
  HeartPulse,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Maximize2,
  MessageCircleHeart,
  MonitorPlay,
  Music,
  Palette,
  Pause,
  Pencil,
  Play,
  RefreshCcw,
  ScanHeart,
  Settings,
  Sparkles,
  Timer,
  Trash2,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useCountdown } from '../hooks/useCountdown';
import { useRevealSettings } from '../hooks/useRevealSettings';
import { useSharedCollection } from '../hooks/useSharedCollection';
import { auth } from '../lib/firebase';
import { MEMORY_STORAGE_KEY, starterMemories, type Memory } from '../lib/memories';
import { MESSAGE_STORAGE_KEY, type FamilyMessage } from '../lib/messages';
import { MOMENTS_STORAGE_KEY, starterMoments, type MomentIcon, type MomentItem } from '../lib/moments';
import { STORY_PAGES_STORAGE_KEY, starterStoryPages, type StoryPage } from '../lib/storyPages';
import type { EffectIntensity, FinaleAnimation, Gender, VisualTheme } from '../types/reveal';


function addMinutes(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function toInputDate(iso: string) {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 16);
}

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/historia', label: 'História', icon: BookOpen },
  { to: '/admin/memorias', label: 'Memórias', icon: ImagePlus },
  { to: '/admin/recados', label: 'Recados', icon: MessageCircleHeart },
  { to: '/admin/momentos', label: 'Momentos', icon: HeartPulse },
];

const iconMap = {
  ultrasound: ScanHeart,
  sparkles: Sparkles,
  baby: Baby,
  heart: HeartPulse,
} satisfies Record<MomentIcon, typeof ScanHeart>;

export function AdminPage() {
  const { settings, updateSettings, isDemo, error } = useRevealSettings();
  const countdown = useCountdown(settings.revealDate, settings.countdownEnabled);
  const location = useLocation();
  const [user, setUser] = useState<User | null>(isDemo ? ({ email: 'demo@local' } as User) : null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [saving, setSaving] = useState(false);
  const { items: memories, removeItem: removeMemoryItem, upsertItem: upsertMemory } = useSharedCollection<Memory>('memories', MEMORY_STORAGE_KEY, starterMemories);
  const { items: messages, removeItem: removeMessageItem } = useSharedCollection<FamilyMessage>('family_messages', MESSAGE_STORAGE_KEY);
  const { items: moments, removeItem: removeMomentItem, upsertItem: upsertMoment } = useSharedCollection<MomentItem>('moments', MOMENTS_STORAGE_KEY, starterMoments);
  const { items: storyPages, removeItem: removeStoryPageItem, upsertItem: upsertStoryPage } = useSharedCollection<StoryPage>('story_pages', STORY_PAGES_STORAGE_KEY, starterStoryPages);
  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [momentTitle, setMomentTitle] = useState('');
  const [momentText, setMomentText] = useState('');
  const [momentIcon, setMomentIcon] = useState<MomentIcon>('heart');
  const [storyPageTitle, setStoryPageTitle] = useState('');
  const [storyPageSubtitle, setStoryPageSubtitle] = useState('');
  const [storyPageBody, setStoryPageBody] = useState('');
  const [editingStoryPageId, setEditingStoryPageId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const statusLabel = useMemo(() => {
    if (settings.revealed || countdown.isComplete) return 'Revelado';
    if (settings.countdownEnabled) return 'Ao vivo';
    return 'Em espera';
  }, [countdown.isComplete, settings.countdownEnabled, settings.revealed]);

  const pageTitle = useMemo(() => {
    if (location.pathname.endsWith('/historia')) return 'História';
    if (location.pathname.endsWith('/memorias')) return 'Memórias';
    if (location.pathname.endsWith('/recados')) return 'Recados';
    if (location.pathname.endsWith('/momentos')) return 'Momentos';
    return 'Dashboard';
  }, [location.pathname]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (!auth) {
      setUser({ email: 'demo@local' } as User);
      return;
    }

    try {
      setLoginError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (loginIssue) {
      setLoginError(loginIssue instanceof Error ? loginIssue.message : 'Não foi possível entrar.');
    }
  }

  async function patchSettings(patch: Parameters<typeof updateSettings>[0]) {
    setSaving(true);
    try {
      await updateSettings(patch);
    } finally {
      setSaving(false);
    }
  }

  async function handleMemorySubmit(event: FormEvent) {
    event.preventDefault();
    if (!memoryTitle.trim() || !memoryText.trim()) return;
    const id = crypto.randomUUID();
    const nextMemory = {
      id,
      title: memoryTitle.trim(),
      text: memoryText.trim(),
      image: '',
      createdAt: new Date().toISOString(),
    };
    await upsertMemory(nextMemory);
    setMemoryTitle('');
    setMemoryText('');
  }

  async function removeMemory(id: string) {
    await removeMemoryItem(id);
  }

  async function removeMessage(id: string) {
    await removeMessageItem(id);
  }

  async function handleStoryPageSubmit(event: FormEvent) {
    event.preventDefault();
    if (!storyPageTitle.trim() || !storyPageBody.trim()) return;

    if (editingStoryPageId) {
      const currentPage = storyPages.find((page) => page.id === editingStoryPageId);
      if (!currentPage) return;
      await upsertStoryPage({
        ...currentPage,
        title: storyPageTitle.trim(),
        subtitle: storyPageSubtitle.trim() || 'Novo capítulo',
        body: storyPageBody.trim(),
      });
      setEditingStoryPageId(null);
      setStoryPageTitle('');
      setStoryPageSubtitle('');
      setStoryPageBody('');
      return;
    }

    const nextPage = {
      id: crypto.randomUUID(),
      title: storyPageTitle.trim(),
      subtitle: storyPageSubtitle.trim() || 'Novo capítulo',
      body: storyPageBody.trim(),
      createdAt: new Date().toISOString(),
    };
    await upsertStoryPage(nextPage);
    setStoryPageTitle('');
    setStoryPageSubtitle('');
    setStoryPageBody('');
  }

  function editStoryPage(page: StoryPage) {
    setEditingStoryPageId(page.id);
    setStoryPageTitle(page.title);
    setStoryPageSubtitle(page.subtitle);
    setStoryPageBody(page.body);
  }

  function cancelStoryPageEdit() {
    setEditingStoryPageId(null);
    setStoryPageTitle('');
    setStoryPageSubtitle('');
    setStoryPageBody('');
  }

  async function removeStoryPage(id: string) {
    await removeStoryPageItem(id);
    if (editingStoryPageId === id) {
      cancelStoryPageEdit();
    }
  }

  async function handleMomentSubmit(event: FormEvent) {
    event.preventDefault();
    if (!momentTitle.trim() || !momentText.trim()) return;
    const nextMoment = {
      id: crypto.randomUUID(),
      title: momentTitle.trim(),
      text: momentText.trim(),
      icon: momentIcon,
    };
    await upsertMoment(nextMoment);
    setMomentTitle('');
    setMomentText('');
    setMomentIcon('heart');
  }

  async function removeMoment(id: string) {
    await removeMomentItem(id);
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-admin px-5 text-white">
        <motion.form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-100/70">
              Painel privado
            </p>
            <h1 className="mt-2 text-3xl font-black">Gestão do Chá Revelação</h1>
          </div>
          <label className="mb-4 block">
            <span className="mb-2 block text-sm text-white/70">Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="mb-5 block">
            <span className="mb-2 block text-sm text-white/70">Senha</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {loginError && (
            <p className="mb-4 rounded-lg bg-rose-500/15 p-3 text-sm text-rose-100">{loginError}</p>
          )}
          <button className="button-primary w-full" type="submit">
            Entrar
          </button>
        </motion.form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-admin text-white">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-logo">
              <Sparkles size={20} />
            </span>
            <div>
              <strong>Chá Revelação</strong>
              <small>Painel de gestão</small>
            </div>
          </div>

          <nav className="admin-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  className={({ isActive }) => clsx(isActive && 'active')}
                  end={item.end}
                  key={item.to}
                  to={item.to}
                >
                  <Icon size={18} /> {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              <Eye size={17} /> Tela pública
            </Link>
            <Link to="/historia" target="_blank" rel="noopener noreferrer">
              <BookOpen size={17} /> História
            </Link>
            <Link to="/memorias" target="_blank" rel="noopener noreferrer">
              <ImagePlus size={17} /> Memórias
            </Link>
          </div>
        </aside>

        <section className="admin-workspace">
          <header className="admin-topbar">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">
                Operação do evento
              </p>
              <h1>{pageTitle}</h1>
            </div>
            <div className="admin-topbar-actions">
              <button
                className="button-ghost"
                onClick={async () => {
                  try {
                    await document.documentElement.requestFullscreen();
                  } catch (error) {
                    console.error('Erro ao entrar em tela cheia:', error);
                  }
                }}
              >
                <Maximize2 size={18} /> Tela cheia
              </button>
              {!isDemo && auth && (
                <button className="button-ghost" onClick={() => auth && signOut(auth)}>
                  <LogOut size={18} /> Sair
                </button>
              )}
            </div>
          </header>

          {(isDemo || error) && (
            <div className="mb-5 rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-50">
              {isDemo
                ? 'Modo demo ativo: preencha o .env com as credenciais Firebase para sincronizar em tempo real.'
                : error}
            </div>
          )}

          <Routes>
            <Route
              index
              element={
                <DashboardView
                  countdownLabel={countdown.label}
                  memoriesCount={memories.length}
                  onPatch={patchSettings}
                  saving={saving}
                  settings={settings}
                  statusLabel={statusLabel}
                />
              }
            />
            <Route
              element={
                <HistoryAdmin
                  body={storyPageBody}
                  editingId={editingStoryPageId}
                  onCancelEdit={cancelStoryPageEdit}
                  onEdit={editStoryPage}
                  onPatch={patchSettings}
                  onRemove={removeStoryPage}
                  onSubmit={handleStoryPageSubmit}
                  pages={storyPages}
                  setBody={setStoryPageBody}
                  setSubtitle={setStoryPageSubtitle}
                  setTitle={setStoryPageTitle}
                  settings={settings}
                  subtitle={storyPageSubtitle}
                  title={storyPageTitle}
                />
              }
              path="historia"
            />
            <Route
              element={
                <MemoriesAdmin
                  memories={memories}
                  onRemove={removeMemory}
                  onSubmit={handleMemorySubmit}
                  setText={setMemoryText}
                  setTitle={setMemoryTitle}
                  text={memoryText}
                  title={memoryTitle}
                />
              }
              path="memorias"
            />
            <Route
              element={<MessagesAdmin messages={messages} onRemove={removeMessage} />}
              path="recados"
            />
            <Route
              element={
                <MomentsAdmin
                  icon={momentIcon}
                  moments={moments}
                  onRemove={removeMoment}
                  onSubmit={handleMomentSubmit}
                  setIcon={setMomentIcon}
                  setText={setMomentText}
                  setTitle={setMomentTitle}
                  text={momentText}
                  title={momentTitle}
                />
              }
              path="momentos"
            />
            <Route element={<Navigate to="/admin" replace />} path="*" />
          </Routes>

          <footer className="admin-footer">
            <span className="flex items-center gap-2">
              <Timer size={16} /> Sincronização em tempo real via Firestore
            </span>
            <span className="flex items-center gap-2">
              <Gauge size={16} /> {saving ? 'Salvando...' : 'Pronto'}
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}

type DashboardViewProps = {
  countdownLabel: string;
  memoriesCount: number;
  onPatch: (
    patch: Parameters<ReturnType<typeof useRevealSettings>['updateSettings']>[0],
  ) => Promise<void>;
  saving: boolean;
  settings: ReturnType<typeof useRevealSettings>['settings'];
  statusLabel: string;
};

function DashboardView({
  countdownLabel,
  memoriesCount,
  onPatch,
  saving,
  settings,
  statusLabel,
}: DashboardViewProps) {
  return (
    <>
      <section className="dashboard-grid">
        <article className="metric-card">
          <span>Status</span>
          <strong>{statusLabel}</strong>
          <small>{settings.countdownEnabled ? 'Cronômetro ativo' : 'Cronômetro pausado'}</small>
        </article>
        <article className="metric-card">
          <span>Tempo</span>
          <strong>{countdownLabel}</strong>
          <small>Sincronizado com a tela pública</small>
        </article>
        <article
          className={clsx('metric-card', settings.gender === 'boy' ? 'metric-blue' : 'metric-pink')}
        >
          <span>Resultado</span>
          <strong>{settings.gender === 'boy' ? 'Menino' : 'Menina'}</strong>
          <small>{settings.babyName || 'Sem nome definido'}</small>
        </article>
        <article className="metric-card">
          <span>Conteúdo</span>
          <strong>{memoriesCount}</strong>
          <small>memórias publicadas</small>
        </article>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ao vivo</p>
            <h2>Controle da tela principal</h2>
          </div>
          <span className="status-pill">
            <Gauge size={16} /> {saving ? 'Salvando...' : 'Pronto'}
          </span>
        </div>
        <div className="control-grid">
          <button
            className="action-card"
            onClick={() =>
              onPatch({ revealDate: addMinutes(3), countdownEnabled: true, revealed: false })
            }
          >
            <Play /> Iniciar 3 min
          </button>
          <button className="action-card" onClick={() => onPatch({ countdownEnabled: false })}>
            <Pause /> Pausar
          </button>
          <button
            className="action-card"
            onClick={() =>
              onPatch({ revealDate: addMinutes(3), countdownEnabled: true, revealed: false })
            }
          >
            <RefreshCcw /> Resetar
          </button>
          <button
            className="action-card danger"
            onClick={() => onPatch({ revealed: true, countdownEnabled: false })}
          >
            <Zap /> Revelar agora
          </button>
          <button
            className="button-primary"
            onClick={() =>
              onPatch({ revealDate: addMinutes(3), revealed: false, countdownEnabled: true })
            }
          >
            <RefreshCcw size={18} /> Replay / reiniciar contagem
          </button>
          <button className="button-secondary" onClick={() => onPatch({ revealed: true })}>
            <Sparkles size={18} /> Testar efeitos
          </button>
        </div>
      </section>

      <section className="admin-columns">
        <RevealAdmin settings={settings} onPatch={onPatch} />
        <VisualAdmin settings={settings} onPatch={onPatch} />
      </section>
    </>
  );
}

function RevealAdmin({ settings, onPatch }: Pick<DashboardViewProps, 'settings' | 'onPatch'>) {
  return (
    <div className="admin-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Revelação</p>
          <h2>Dados do bebê</h2>
        </div>
        <Settings size={20} className="text-white/45" />
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Sexo</span>
          <select
            className="input"
            value={settings.gender}
            onChange={(event) => onPatch({ gender: event.target.value as Gender, revealed: false })}
          >
            <option value="boy">Menino</option>
            <option value="girl">Menina</option>
          </select>
        </label>
        <label className="field">
          <span>Nome do bebê</span>
          <input
            className="input"
            value={settings.babyName}
            onChange={(event) => onPatch({ babyName: event.target.value })}
            placeholder="Theo, Aurora..."
          />
        </label>
        <label className="field form-span">
          <span>Data e hora da revelação</span>
          <input
            className="input"
            type="datetime-local"
            value={toInputDate(settings.revealDate)}
            onChange={(event) =>
              onPatch({ revealDate: new Date(event.target.value).toISOString(), revealed: false })
            }
          />
        </label>
      </div>
    </div>
  );
}

function VisualAdmin({ settings, onPatch }: Pick<DashboardViewProps, 'settings' | 'onPatch'>) {
  return (
    <div className="admin-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Visual</p>
          <h2>Aparência e efeitos</h2>
        </div>
        <Palette size={20} className="text-white/45" />
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Tema visual</span>
          <select
            className="input"
            value={settings.theme}
            onChange={(event) => onPatch({ theme: event.target.value as VisualTheme })}
          >
            <option value="aurora">Aurora neon</option>
            <option value="starlight">Starlight premium</option>
            <option value="velvet">Velvet cinematic</option>
          </select>
        </label>
        <label className="field">
          <span>Intensidade</span>
          <select
            className="input"
            value={settings.effectIntensity}
            onChange={(event) =>
              onPatch({ effectIntensity: event.target.value as EffectIntensity })
            }
          >
            <option value="soft">Suave</option>
            <option value="cinematic">Cinemática</option>
            <option value="epic">Épica</option>
          </select>
        </label>
        <label className="field">
          <span>Animação final</span>
          <select
            className="input"
            value={settings.finaleAnimation}
            onChange={(event) =>
              onPatch({ finaleAnimation: event.target.value as FinaleAnimation })
            }
          >
            <option value="confetti">Confetes + flash</option>
            <option value="fireworks">Fogos digitais</option>
            <option value="slowMotion">Câmera lenta</option>
          </select>
        </label>
        <button
          className="button-secondary justify-between"
          onClick={() => onPatch({ musicEnabled: !settings.musicEnabled })}
        >
          <span className="flex items-center gap-2">
            <Music size={18} /> Música ambiente
          </span>
          <span>{settings.musicEnabled ? 'Ativa' : 'Inativa'}</span>
        </button>
      </div>
    </div>
  );
}

type HistoryAdminProps = Pick<DashboardViewProps, 'settings' | 'onPatch'> & {
  body: string;
  editingId: string | null;
  onCancelEdit: () => void;
  onEdit: (page: StoryPage) => void;
  onRemove: (id: string) => void;
  onSubmit: (event: FormEvent) => void;
  pages: StoryPage[];
  setBody: (value: string) => void;
  setSubtitle: (value: string) => void;
  setTitle: (value: string) => void;
  subtitle: string;
  title: string;
};

function HistoryAdmin({
  body,
  editingId,
  onCancelEdit,
  onEdit,
  onPatch,
  onRemove,
  onSubmit,
  pages,
  setBody,
  setSubtitle,
  setTitle,
  settings,
  subtitle,
  title,
}: HistoryAdminProps) {
  return (
    <>
      <section className="admin-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Livro do bebê</p>
            <h2>Resumo da página pública</h2>
          </div>
          <Link className="button-ghost" to="/historia" target="_blank">
            <BookOpen size={18} /> Ver página
          </Link>
        </div>
        <div className="form-grid form-grid-wide">
          <label className="field">
            <span>Semana / status atual</span>
            <input
              className="input"
              value={settings.currentWeek}
              onChange={(event) => onPatch({ currentWeek: event.target.value })}
            />
          </label>
          <label className="field">
            <span>Próximo marco</span>
            <input
              className="input"
              value={settings.nextMilestone}
              onChange={(event) => onPatch({ nextMilestone: event.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Capa do livro</p>
            <h2>Texto principal do livro</h2>
          </div>
          <span className="status-pill">Aparece na página esquerda</span>
        </div>
        <div className="form-grid form-grid-wide story-cover-form">
          <label className="field">
            <span>Título da capa</span>
            <input
              className="input"
              value={settings.storyTitle}
              onChange={(event) => onPatch({ storyTitle: event.target.value })}
            />
          </label>
          <label className="field form-span">
            <span>Texto de abertura da capa</span>
            <textarea
              className="input min-h-32 resize-y"
              value={settings.storyIntro}
              onChange={(event) => onPatch({ storyIntro: event.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Páginas do livro</p>
            <h2>Nova publicação</h2>
          </div>
          <span className="status-pill">{pages.length} páginas</span>
        </div>
        <div className="admin-columns">
          <form className="content-form" onSubmit={onSubmit}>
            <label className="field">
              <span>Título da página</span>
              <input
                className="input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="O primeiro ultrassom..."
              />
            </label>
            <label className="field">
              <span>Subtítulo / separador</span>
              <input
                className="input"
                value={subtitle}
                onChange={(event) => setSubtitle(event.target.value)}
                placeholder="Capítulo 01, uma descoberta especial..."
              />
            </label>
            <label className="field">
              <span>Desenvolvimento do texto</span>
              <textarea
                className="input min-h-56 resize-y"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Escreva a história dessa página com detalhes, sentimentos e acontecimentos..."
              />
            </label>
            <button className="button-primary w-full" type="submit">
              <BookOpen size={18} />
              {editingId ? 'Salvar alterações' : 'Publicar página'}
            </button>
            {editingId && (
              <button type="button" className="button-secondary w-full mt-2" onClick={onCancelEdit}>
                Cancelar edição
              </button>
            )}
          </form>

          <div className="content-list">
            {pages.map((page, index) => (
              <article className="management-row management-row-message" key={page.id}>
                <span className="row-placeholder">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{page.title}</strong>
                  <p className="line-clamp-3">{page.subtitle}</p>

                  <small className="text-white/60">{page.body.slice(0, 120)}...</small>
                </div>
                <div className="flex gap-2">
                  <button
                    className="icon-button"
                    onClick={() => onEdit(page)}
                    title="Editar página"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="icon-button"
                    onClick={() => {
                      if (window.confirm('Deseja realmente excluir esta página?')) {
                        onRemove(page.id);
                      }
                    }}
                    title="Excluir página"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

type MemoriesAdminProps = {
  memories: Memory[];
  onRemove: (id: string) => void;
  onSubmit: (event: FormEvent) => void;
  setText: (value: string) => void;
  setTitle: (value: string) => void;
  text: string;
  title: string;
};

function MemoriesAdmin({
  memories,
  onRemove,
  onSubmit,
  setText,
  setTitle,
  text,
  title,
}: MemoriesAdminProps) {
  return (
    <section className="admin-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Memórias</p>
          <h2>Gestão da linha do tempo</h2>
        </div>
        <Link className="button-ghost" to="/memorias" target="_blank">
          <MonitorPlay size={18} /> Ver público
        </Link>
      </div>
      <div className="admin-columns">
        <form className="content-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Título</span>
            <input
              className="input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Primeiro ultrassom, chá revelação..."
            />
          </label>
          <label className="field">
            <span>Texto</span>
            <textarea
              className="input min-h-32 resize-y"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Conte o que aconteceu nesse momento..."
            />
          </label>
          <button className="button-primary w-full" type="submit">
            <Camera size={18} /> Publicar memória
          </button>
        </form>
        <ManagementList items={memories} onRemove={onRemove} />
      </div>
    </section>
  );
}

function MessagesAdmin({
  messages,
  onRemove,
}: {
  messages: FamilyMessage[];
  onRemove: (id: string) => void;
}) {
  const sortedMessages = [...messages].sort((first, second) =>
    second.createdAt.localeCompare(first.createdAt),
  );
  return (
    <section className="admin-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Recados</p>
          <h2>Moderação dos recados da família</h2>
        </div>
        <Link className="button-ghost" to="/recados" target="_blank">
          <MonitorPlay size={18} /> Ver público
        </Link>
      </div>
      <div className="content-list">
        {sortedMessages.length === 0 ? (
          <article className="empty-state">Nenhum recado recebido ainda.</article>
        ) : (
          sortedMessages.map((message) => (
            <article className="management-row management-row-message" key={message.id}>
              <span className="row-placeholder">{message.author.slice(0, 2).toUpperCase()}</span>
              <div>
                <strong>{message.author}</strong>
                <p>{message.text}</p>
              </div>
              <button
                className="icon-button"
                onClick={() => onRemove(message.id)}
                title="Excluir recado"
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

type MomentsAdminProps = {
  icon: MomentIcon;
  moments: MomentItem[];
  onRemove: (id: string) => void;
  onSubmit: (event: FormEvent) => void;
  setIcon: (value: MomentIcon) => void;
  setText: (value: string) => void;
  setTitle: (value: string) => void;
  text: string;
  title: string;
};

function MomentsAdmin({
  icon,
  moments,
  onRemove,
  onSubmit,
  setIcon,
  setText,
  setTitle,
  text,
  title,
}: MomentsAdminProps) {
  return (
    <section className="admin-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Momentos</p>
          <h2>Gestão dos cards de acompanhamento</h2>
        </div>
        <Link className="button-ghost" to="/momentos" target="_blank">
          <MonitorPlay size={18} /> Ver público
        </Link>
      </div>
      <div className="admin-columns">
        <form className="content-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Ícone</span>
            <select
              className="input"
              value={icon}
              onChange={(event) => setIcon(event.target.value as MomentIcon)}
            >
              <option value="ultrasound">Ultrassom</option>
              <option value="sparkles">Descoberta</option>
              <option value="baby">Bebê</option>
              <option value="heart">Coração</option>
            </select>
          </label>
          <label className="field">
            <span>Título</span>
            <input
              className="input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ultrassons, descobertas..."
            />
          </label>
          <label className="field">
            <span>Texto</span>
            <textarea
              className="input min-h-32 resize-y"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Descreva esse momento para a família..."
            />
          </label>
          <button className="button-primary w-full" type="submit">
            <HeartPulse size={18} /> Publicar momento
          </button>
        </form>
        <div className="content-list">
          {moments.map((moment) => {
            const Icon = iconMap[moment.icon];
            return (
              <article className="management-row" key={moment.id}>
                <span className="row-placeholder">
                  <Icon size={22} />
                </span>
                <div>
                  <strong>{moment.title}</strong>
                  <p>{moment.text}</p>
                </div>
                <button
                  className="icon-button"
                  onClick={() => onRemove(moment.id)}
                  title="Excluir momento"
                >
                  <Trash2 size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ManagementList({ items, onRemove }: { items: Memory[]; onRemove: (id: string) => void }) {
  return (
    <div className="content-list">
      {items.map((memory, index) => (
        <article className="management-row" key={memory.id}>
          {memory.image ? (
            <img src={memory.image} alt={memory.title} />
          ) : (
            <span className="row-placeholder">{String(index + 1).padStart(2, '0')}</span>
          )}
          <div>
            <strong>{memory.title}</strong>
            <p>{memory.text}</p>
          </div>
          <button
            className="icon-button"
            onClick={() => onRemove(memory.id)}
            title="Excluir memória"
          >
            <Trash2 size={17} />
          </button>
        </article>
      ))}
    </div>
  );
}
