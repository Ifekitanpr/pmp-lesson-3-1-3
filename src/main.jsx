import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BellRing,
  BookOpen,
  Check,
  ChevronDown,
  CircleDollarSign,
  GitBranch,
  Menu,
  Network,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import "./styles.css";
import escalationGapImg from "./assets/illustrations/escalation-gap-v4.png";
import governanceGapDrawerImg from "./assets/illustrations/governance-gap-drawer.png";
import levelsImg from "./assets/illustrations/framework-levels.png";
import triggersImg from "./assets/illustrations/framework-triggers.png";
import protocolsImg from "./assets/illustrations/framework-protocols.png";
import resolutionImg from "./assets/illustrations/framework-resolution.png";
import escalationPathCard from "./assets/illustrations/escalation-path-card.png";
import escalationThresholdCard from "./assets/illustrations/escalation-threshold-card.png";
import predictiveImg from "./assets/illustrations/approach-predictive.png";
import adaptiveImg from "./assets/illustrations/approach-adaptive.png";
import hybridImg from "./assets/illustrations/approach-hybrid.png";
import lowestLevelImg from "./assets/illustrations/lowest-level-resolution.png";

const screens = [
  "The gap",
  "Path + threshold",
  "The framework",
  "Tailor the route",
  "Exam lens",
];

const framework = [
  {
    name: "Levels",
    icon: Users,
    kicker: "Escalation Levels — the chain itself",
    text: "This is the ladder an issue climbs, and each rung is defined by the type of authority it needs. At the team level, issues stay local — schedule tweaks, technical calls, minor quality variances that fall inside agreed tolerance; the people closest to the work resolve it without ceremony. Once an issue touches scope, schedule commitments, or coordination across teams, it moves to the project manager, who holds the cross-functional view the team doesn't. And when the stakes turn strategic, financial, regulatory, or reputational, it goes to the steering committee or executive sponsor — the only level with the authority to absorb that kind of risk. PMBOK® 8 is specific here: the sponsor is named as the PM's primary escalation point, the lever that unlocks resources and breaks ties across departments that the PM alone can't move.",
    note: "The sponsor is the PM's primary escalation point, the lever that unlocks resources and breaks ties across departments that the PM alone can't move.",
    image: levelsImg,
  },
  {
    name: "Triggers",
    icon: BellRing,
    kicker: "Triggers and Thresholds — what makes escalation mandatory, not optional",
    text: "A trigger turns \"I could escalate this\" into \"I must.\" Common ones include a budget overrun crossing a defined percentage, a schedule variance exceeding agreed tolerance, a scope change material enough to shift outcomes, a regulatory or legal risk capable of halting progress, and any safety or ethical concern demanding immediate attention. PMBOK® 8 connects this directly to investment control — the formal stewardship of project funding — which often builds in explicit decision points during design and build phases specifically to ask whether continued investment still makes business sense. Thresholds are what turn that abstract check into something concrete and unmissable.",
    note: "A trigger turns \"I could escalate this\" into \"I must.\"",
    image: triggersImg,
  },
  {
    name: "Protocols",
    icon: Network,
    kicker: "Communication Protocols — how escalation actually moves",
    text: "Having a path means nothing if nobody agrees on how information travels along it. This component nails down the medium — is this a structured written report, a scheduled meeting, or an immediate notification? — who else needs visibility beyond the decision-maker, and what response time is expected. That last detail matters more than it sounds: a critical issue sitting inside a 48-hour silence window isn't a minor gap, it's a governance failure already underway. Clarity here is what stops an escalated issue from disappearing into the space between two people's job descriptions.",
    note: "Clarity stops an escalated issue from disappearing into the space between two people's job descriptions.",
    image: protocolsImg,
  },
  {
    name: "Resolution",
    icon: RefreshCw,
    kicker: "Resolution Flow — where the loop actually closes",
    text: "Escalation without a tracked resolution just generates noise, and repeated noise erodes a team's trust that the system works at all. This component defines, for every level of escalation, who holds the authority to decide, how that decision gets documented, and — critically — how the resolution gets communicated back down to the people who raised it in the first place. PMBOK® 8 treats effective feedback mechanisms as a core governance component precisely because they let decision-makers see whether their calls actually worked, and adjust the next time around.",
    note: "Effective feedback lets decision-makers see whether their calls worked and adjust the next time around.",
    image: resolutionImg,
  },
];

const approaches = {
  Predictive: {
    icon: ShieldCheck,
    tag: "Predictive",
    title: "Formal and hierarchical almost by design",
    text: "Here, escalation is formal and hierarchical almost by design. Issues surface through structured, documented channels — phase gate reviews, change control boards, formal escalation requests submitted in writing. The governance model is comprehensive on purpose, with defined investment control points and clear formal approval chains at every stage. This weight is intentional: it suits large, complex, or regulated projects where a wrong decision carries serious downstream consequences, and where a paper trail isn't bureaucracy — it's protection.",
    path: ["Team", "PM", "CCB", "Sponsor"],
    image: predictiveImg,
  },
  Adaptive: {
    icon: RefreshCw,
    tag: "Adaptive",
    title: "Escalation is built into the team's daily rhythm",
    text: "Here, escalation isn't a separate event — it's built into the team's daily rhythm. Daily stand-ups surface blockers almost as they happen. Sprint retrospectives catch the systemic issues that a single stand-up would miss. The vast majority of problems never leave the team, resolved inside its own self-organizing authority. Escalation beyond the team is reserved for genuinely high-impact risks — not every friction point that comes up during a sprint. PMBOK® 8 describes self-governed teams as collectively accountable for their own performance, held together by shared objectives and tight feedback loops that prevent decisions from fragmenting across individuals.",
    path: ["Stand-up", "Team", "Backlog", "Escalate only if high-impact"],
    image: adaptiveImg,
  },
  Hybrid: {
    icon: GitBranch,
    tag: "Hybrid",
    title: "Both mechanisms run side by side",
    text: "Here, both mechanisms run side by side, and that coexistence is the whole point. Formal escalation still handles strategic, regulatory, or financial decisions — the stakes haven't changed just because part of the project is agile. Day-to-day blockers, meanwhile, get resolved at the team level inside sprint cadence, the same way they would in a fully adaptive environment. What makes hybrid genuinely hard is that the project manager has to actively maintain the line between the two channels — because the moment a team-level blocker gets routed into the formal chain (or vice versa), you've recreated the exact bottleneck the escalation framework was built to eliminate.",
    path: ["Team blockers → sprint", "Strategic issues → sponsor"],
    image: hybridImg,
  },
};

const quiz1 = {
  q: "A junior team member spots a schedule slip that’s still within agreed tolerance. Should this escalate?",
  answers: [
    "Yes — any schedule slip should go up immediately",
    "No — it’s within tolerance, so it stays at team level",
    "Only if the sponsor asks about it",
    "Yes — thresholds don’t apply to schedule issues",
  ],
  correct: 1,
  yes: "Right — the threshold hasn't been crossed yet. The path exists, but nothing has triggered it. Escalating regardless of severity defeats the entire purpose of setting a threshold in the first place.",
  no: "Not quite — the threshold is what decides whether this issue is even eligible to leave the team's desk, and this one hasn't reached that point.",
};
const quiz2 = {
  q: "A hybrid team’s daily blocker keeps getting raised at the monthly steering committee. What’s the real problem?",
  answers: [
    "The committee meets too rarely",
    "The team doesn't understand escalation channels — day-to-day blockers belong at the team level",
    "The blocker is too minor to matter",
    "Hybrid projects shouldn’t have steering committees",
  ],
  correct: 1,
  yes: "Exactly — in hybrid environments, the PM's real job is keeping the two channels distinct. Routing a team-level blocker into a strategic, monthly-cadence body creates the same delay the escalation framework exists to prevent.",
  no: "Look again at what's actually failing here — it isn't the committee's schedule, it's which channel this issue was sent through in the first place.",
};

function tone(kind, enabled) {
  if (!enabled) return;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  const c = new C(),
    o = c.createOscillator(),
    g = c.createGain(),
    n = c.currentTime;
  o.frequency.value = kind === "success" ? 720 : 430;
  g.gain.setValueAtTime(0.03, n);
  g.gain.exponentialRampToValueAtTime(0.0001, n + 0.14);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(n + 0.15);
  o.onended = () => c.close();
}

function Quiz({ data, onDone, onFinish }) {
  const [picked, setPicked] = useState(null);
  const [closed, setClosed] = useState(false);
  const choose = (i) => {
    if (picked === data.correct) return;
    setPicked(i);
    tone(i === data.correct ? "success" : "tap", true);
    if (i === data.correct) onDone();
  };
  if (closed) return null;
  return createPortal(
    <motion.div className="knowledge-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.section className="quiz knowledge-modal" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} role="dialog" aria-modal="true" aria-label="Micro knowledge check">
      <div className="quiz-label">
        <Target size={16} /> MICRO KNOWLEDGE CHECK
      </div>
      <h3>{data.q}</h3>
      <div className="answers">
        {data.answers.map((a, i) => (
          <button
            key={a}
            onClick={() => choose(i)}
            className={
              picked === i
                ? i === data.correct
                  ? "correct"
                  : "wrong"
                : picked !== null && i === data.correct
                  ? "correct reveal"
                  : ""
            }
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {a}
            {picked !== null && i === data.correct && <Check size={18} />}
          </button>
        ))}
      </div>
      {picked !== null && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={picked === data.correct ? "feedback good" : "feedback bad"}
        >
          {picked === data.correct
            ? data.yes
            : data.no}
        </motion.p>
      )}
      {picked !== null && (
        <button className="finish-check" onClick={() => { setClosed(true); onFinish?.(); }}>
          Finish check <ArrowRight size={18} />
        </button>
      )}
    </motion.section>
    </motion.div>,
    document.body,
  );
}

function PathGraphic({ complete = false }) {
  return (
    <div className={`path-graphic ${complete ? "complete" : ""}`}>
      <div className="report">
        <CircleDollarSign />
        <b>Vendor cost report</b>
        <span>+8.4% forecast</span>
      </div>
      <div className="route-line">
        <i />
        <i />
        <i />
      </div>
      <div className="people">
        <span>
          <Users />
          TEAM
        </span>
        <span>
          <Route />
          PM
        </span>
        <span>
          <ShieldCheck />
          SPONSOR
        </span>
      </div>
    </div>
  );
}

function DetailSheet({ detail, onClose, onRead, modal = false }) {
  useEffect(() => {
    const close = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  if (!detail) return null;
  const Icon = detail.icon;
  return createPortal(
    <motion.div className={`modal-backdrop ${modal ? "focused-modal-backdrop" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{duration:.22}} onClick={onClose}>
      <motion.aside className={modal ? "detail-sheet detail-modal" : "detail-sheet"} initial={modal ? {opacity:0,y:28,scale:.96} : {x:"100%"}} animate={modal ? {opacity:1,y:0,scale:1} : {x:0}} exit={modal ? {opacity:0,y:18,scale:.97} : {x:"100%"}} transition={{ type: "spring", stiffness: 300, damping: 30, mass:.8 }} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Close detail"><X size={22} /></button>
        {detail.image ? <img className="drawer-illustration" src={detail.image} alt="" /> : Icon && <div className="sheet-icon"><Icon /></div>}
        <p className="mini-label">{detail.kicker || detail.tag}</p>
        <h3>{detail.name || detail.title}</h3>
        <p>{detail.text}</p>
        {(detail.note || detail.path) && <div className="sheet-note"><Target size={18} /><span>{detail.note || detail.path.join(" → ")}</span></div>}
        <button className="modal-close-bottom" onClick={onRead || onClose}><Check size={18} /> Mark as read</button>
      </motion.aside>
    </motion.div>,
    document.body,
  );
}

function App() {
  const [page, setPage] = useState(0),
    [sound, setSound] = useState(true),
    [reveal, setReveal] = useState(false),
    [flips, setFlips] = useState([]),
    [q1, setQ1] = useState(false),
    [open, setOpen] = useState(0),
    [seen, setSeen] = useState([]),
    [approach, setApproach] = useState("Predictive"),
    [approachSeen, setApproachSeen] = useState([]),
    [q2, setQ2] = useState(false),
    [done, setDone] = useState(false),
    [menu, setMenu] = useState(false),
    [quizOpen, setQuizOpen] = useState(false),
    [detail, setDetail] = useState(null);
  useEffect(() => {
    setReveal(false);
    setQuizOpen(false);
  }, [page]);
  const canNext = [
    reveal,
    flips.length === 2 && q1,
    seen.length === 4,
    approachSeen.length === 3 && q2,
    done,
  ][page];
  useEffect(() => {
    if (canNext) requestAnimationFrame(() => document.querySelector(".nav-footer")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }, [canNext, page]);
  const next = () => {
    if (page < 4 && canNext) {
      tone("success", sound);
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const selectFramework = (i) => {
    setOpen(i);
    setDetail(framework[i]);
    tone("tap", sound);
  };
  const openFrameworkDetail = () => {
    setDetail(framework[open]);
    tone("tap", sound);
  };
  const markDetailRead = () => {
    if (page === 2 && detail === framework[open]) {
      setSeen((items) => (items.includes(open) ? items : [...items, open]));
      if (open < framework.length - 1) setOpen(open + 1);
    }
    if (page === 3 && detail === approaches[approach]) {
      const keys = Object.keys(approaches);
      setApproachSeen((items) => items.includes(approach) ? items : [...items, approach]);
      const index = keys.indexOf(approach);
      if (index < keys.length - 1) setApproach(keys[index + 1]);
    }
    setDetail(null);
  };
  const progress = Math.round(((page + (canNext ? 1 : 0)) / 5) * 100);
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="course-select" type="button">
          <Award size={24} />
          <span>PMP Project Management Professional</span>
          <ChevronDown size={20} />
        </button>
        <div className="module-progress" aria-label="Course progress">
          <div>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={`progress-dot ${i < 7 ? "done" : i === 7 ? "active" : ""}`}
              >
                {i < 7 ? <Check size={10} /> : <span />}
              </span>
            ))}
          </div>
          <div>
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="progress-dot">
                <span />
              </span>
            ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">
            <X size={20} />
            <span>Quit</span>
          </button>
        </div>
      </header>
      <section className="workspace">
        <div className="lesson-stage">
          <div className="outline">
            <button className="menu-button" onClick={() => setMenu(!menu)}>
              <Menu size={20} />
            </button>
            {menu && (
              <div className="outline-panel">
                <div className="outline-summary">
                  <div>
                    <strong>Lesson 3.1.3</strong>
                    <span>{progress}%</span>
                  </div>
                  <span className="summary-track">
                    <span style={{ width: `${progress}%` }} />
                  </span>
                </div>
                <section className="study-block">
                  <div className="study-heading">
                    <span>
                      <BookOpen size={18} /> Study Plan
                    </span>
                    <span className="block-status">{page + 1}</span>
                  </div>
                  <div className="lesson-list">
                    {screens.map((title, i) => (
                      <button
                        key={title}
                        className={i === page ? "lesson current" : "lesson"}
                        disabled={i > page}
                        onClick={() => setPage(i)}
                      >
                        <span
                          className={`progress-dot ${i < page ? "done" : i === page ? "active" : ""}`}
                        >
                          {i < page ? <Check size={10} /> : <span />}
                        </span>
                        <span>{title}</span>
                        <small>{i + 1}</small>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <nav className="section-tabs">
              <p className="section-tabs-count">Section {page + 1} of 5</p>
              <div className="section-tabs-row">
                {screens.map((title, i) => (
                  <button
                    key={title}
                    className={`section-tab ${i === page ? "active" : i < page ? "done" : "locked"}`}
                    disabled={i > page}
                    onClick={() => setPage(i)}
                  >
                    {i < page && <Check size={14} />}
                    <span>{title}</span>
                  </button>
                ))}
              </div>
            </nav>
            <AnimatePresence mode="wait">
              <motion.section
                key={page}
                className={`lesson-content custom-stage page-${page}`}
                initial={{ opacity: 0, x: 70, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -48, filter: "blur(6px)" }}
                transition={{ duration: 0.48 }}
              >
                {page === 0 && (
                  <>
                    <div className="copy">
                      <p className="eyebrow">LESSON 3.1.3</p>
                      <h1>Outline Escalation Paths and Thresholds</h1>
                      <p>Picture a project three weeks in. A vendor just flagged a cost overrun. The technical lead thinks it's fine to absorb. The sponsor hasn't been told. Nobody's actually wrong — nobody knows whose call this is.</p>
                      <button
                        className="primary"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "That moment is the exact gap escalation paths and thresholds exist to close",
                            kicker: "CLICK-TO-REVEAL",
                            icon: Route,
                            image: governanceGapDrawerImg,
                            text: "That moment — the pause where a manageable issue quietly turns into a stalled one — is the exact gap escalation paths and thresholds exist to close. Issues aren't the risk. Every project has them; that part is guaranteed. The real risk is a project that hasn't already decided, in advance, who owns a problem, how far it can travel before someone else needs to step in, and where it lands when it does. This lesson builds that decision-making map before you ever need it — and shows how the map itself changes shape depending on whether your project runs predictive, adaptive, or hybrid.",
                            note: "This lesson builds that decision-making map before you ever need it.",
                          });
                          tone("tap", sound);
                        }}
                      >
                        {reveal
                          ? "Review the governance gap"
                          : "Reveal the governance gap"}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                    <img className="lesson-illustration hero-illustration governance-art" src={escalationGapImg} alt="One raised issue reaches the vendor, technical lead, and sponsor but ends at an unassigned decision owner" />
                  </>
                )}
                {page === 1 && (
                  <div className="wide">
                    <p className="eyebrow">SCREEN 2</p>
                    <h2>Two Terms, One System</h2>
                    <p className="lede">Two words get used almost interchangeably in project governance conversations — "path" and "threshold" — but they're answering two completely different questions, and mixing them up is how escalation frameworks fail quietly.</p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "Escalation path",
                          q: "WHO DOES THIS GO TO?",
                          icon: Route,
                          image: escalationPathCard,
                          body: "Think of this as the map, not the trigger. It's the pre-agreed route an issue travels once it needs to move — team member, to project manager, to sponsor, to steering committee — each stop carrying more authority than the last. The path exists so nobody has to improvise, mid-crisis, who's supposed to pick up the phone. It answers one question only: who does this go to?",
                        },
                        {
                          name: "Escalation threshold",
                          q: "WHEN DOES IT LEAVE MY DESK?",
                          icon: BellRing,
                          image: escalationThresholdCard,
                          body: "This is the tripwire, not the map. A threshold is the specific point — defined in cost, schedule slippage, risk exposure, or strategic consequence — where an issue stops being something the current owner can absorb and starts being something that has to move. Without a defined threshold, \"when do I escalate\" becomes a judgment call made under pressure, which is exactly when judgment is least reliable. It answers: when does it leave my desk?",
                        },
                      ].map((c, i) => {
                        const on = flips.includes(i),
                          I = c.icon;
                        return (
                          <div className="illustrated-flip" key={c.name}>
                          <img className="flip-card-art" src={c.image} alt="" />
                          <button
                            className={`flip ${on ? "flipped" : ""}`}
                            onClick={() =>
                              setFlips((s) => (s.includes(i) ? s : [...s, i]))
                            }
                          >
                            <div className="flip-inner">
                              <div className="flip-front">
                                <small>CLICK TO FLIP</small>
                                <h3>{c.name}</h3>
                                <p>
                                  {i === 0
                                    ? "The map, not the trigger"
                                    : "The tripwire, not the map"}
                                </p>
                              </div>
                              <div className="flip-back">
                                <small>{c.q}</small>
                                <h3>{c.name}</h3>
                                <p>{c.body}</p>
                              </div>
                            </div>
                          </button>
                          </div>
                        );
                      })}
                    </div>
                    {flips.length === 2 && (
                      <>
                        <div className="backing">PMBOK® 8 frames escalation as a governance component that carries particular weight in predictive environments and hierarchical organizations — settings where decision-making authority deliberately sits above the immediate project team, held by people with the positional power to clear obstacles, resolve conflict, and protect the project's odds of success in ways the team alone cannot.</div>
                        {!q1 && <button className="knowledge-check-cta" onClick={() => setQuizOpen(true)}>
                          <Target size={18} /> Start knowledge check <ArrowRight size={18} />
                        </button>}
                        {quizOpen && !q1 && <Quiz data={quiz1} onDone={() => {}} onFinish={() => { setQ1(true); setQuizOpen(false); }} />}
                      </>
                    )}
                  </div>
                )}
                {page === 2 && (
                  <div className="wide">
                    <p className="eyebrow">SCREEN 3</p>
                    <h2>The Four-Part Framework</h2>
                    <p className="lede">Zoom out from any single issue, and every functioning escalation system — regardless of industry or project size — is built from the same four moving parts, working together like gears in the same mechanism. Click each one to see what it actually does.</p>
                    <div className="direct-card-grid" aria-label="Four-part framework selector">
                        {framework.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.name}
                              className={`direct-detail-card ${seen.includes(index) ? "visited" : ""}`}
                              onClick={() => selectFramework(index)}
                            >
                              <span className="direct-card-icon">
                                <Icon />
                              </span>
                              <span className="direct-card-copy"><small>{seen.includes(index) ? <><Check size={14}/> READ</> : `0${index + 1}`}</small><strong>{item.name}</strong></span>
                              <ArrowRight className="direct-card-arrow" />
                            </button>
                          );
                        })}
                    </div>
                    <div className="thread">
                      {framework.map((_, i) => (
                        <span className={seen.includes(i) ? "lit" : ""} />
                      ))}
                    </div>
                  </div>
                )}
                {page === 3 && (
                  <div className="wide">
                    <p className="eyebrow">SCREEN 4</p>
                    <h2>How Escalation Shifts by Approach</h2>
                    <p className="lede">The four components you just explored don't change — but the rhythm they run on shifts completely depending on how the project is being delivered. Toggle between the three to see how the same framework plays out differently in practice.</p>
                    <div className="direct-card-grid three-up" aria-label="Delivery approaches">
                      {Object.keys(approaches).map((k, index) => (
                        <button key={k} className={`direct-detail-card ${approachSeen.includes(k) ? "visited" : ""}`} onClick={() => {setApproach(k);setDetail(approaches[k]);}}>
                          <span className="direct-card-icon">{React.createElement(approaches[k].icon)}</span><span className="direct-card-copy"><small>{approachSeen.includes(k) ? <><Check size={14}/> READ</> : `0${index + 1}`}</small><strong>{k}</strong></span><ArrowRight className="direct-card-arrow" />
                        </button>
                      ))}
                    </div>
                    {approachSeen.length === 3 && !q2 && <button className="knowledge-check-cta" onClick={() => setQuizOpen(true)}>
                      <Target size={18} /> Start knowledge check <ArrowRight size={18} />
                    </button>}
                    {quizOpen && !q2 && <Quiz data={quiz2} onDone={() => {}} onFinish={() => { setQ2(true); setQuizOpen(false); }} />}
                  </div>
                )}
                {page === 4 && (
                  <div className="final">
                    <img className="lesson-illustration final-illustration" src={lowestLevelImg} alt="A team issue stops with the project manager who has the information and authority to decide, while the sponsor remains available above" />
                    <div className="final-copy">
                      <p className="eyebrow">SCREEN 5 · SYNTHESIS (EXAM LENS)</p>
                      <h2>Strip away every example from this lesson, and one idea sits underneath all of it — one worth carrying into the exam room and into every project you'll ever run.</h2>
                      {!done ? (
                        <button
                          className="primary"
                          onClick={() => {
                            setDone(true);
                            tone("success", sound);
                          }}
                        >
                          Reveal the synthesis <Sparkles size={18} />
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <p className="exam-synthesis">Escalation isn't a sign that a project expects to fail. It's a sign that a project expects reality — and reality includes surprises no one can fully plan around. PMBOK® 8's principle here is consistent and worth committing to memory: resolve issues at the lowest level that holds both the authority and the information to decide. Escalating a genuinely above-threshold issue is responsible governance, not a failure to cope. Sitting on one, hoping it resolves itself, is not diligence — it's a governance failure with a delay built in.</p>
                          <h3>Exam-relevant enablers to remember:</h3>
                          <ul>
                            <li>Define paths and thresholds before the project needs them — not while it's already in crisis</li>
                            <li>Tailor the approach: formal and documented for predictive, embedded in team ritual for adaptive, deliberately dual-channel for hybrid</li>
                            <li>The sponsor is the PM's primary escalation point (PMBOK® 8) — the lever for resources and cross-functional ties</li>
                            <li>Resolution flow is what closes the loop — without feedback back to the team, there's no governance, just noise</li>
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
                {canNext && (
                  <motion.div
                    className="anchor"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Check size={20} />
                    <span>
                      {page === 4
                        ? "Lesson complete — the escalation loop is closed."
                        : "Interaction complete — continue when ready."}
                    </span>
                  </motion.div>
                )}
              </motion.section>
            </AnimatePresence>
            <footer className="nav-footer">
              <button
                className="secondary-button"
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                <ArrowLeft size={18} /> Previous
              </button>
              <button
                className={
                  canNext ? "primary-button unlocked" : "primary-button"
                }
                disabled={!canNext}
                onClick={page < 4 ? next : undefined}
              >
                {!canNext
                  ? "Complete interactions"
                  : page === 4
                    ? "Complete"
                    : "Continue"}
                <ArrowRight size={18} />
              </button>
            </footer>
          </article>
        </div>
      </section>
      <AnimatePresence>
        {detail && <DetailSheet detail={detail} modal={page === 0 || page === 2 || page === 3} onClose={() => setDetail(null)} onRead={markDetailRead} />}
      </AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
