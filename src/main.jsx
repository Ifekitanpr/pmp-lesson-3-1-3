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
    kicker: "The chain itself",
    text: "Issues climb only as far as the authority they need. Teams handle local calls inside tolerance; project managers own cross-functional commitments; sponsors and steering committees absorb strategic, financial, regulatory, or reputational risk.",
    note: "The sponsor is the PM’s primary escalation point — the lever for resources and cross-functional ties.",
    image: levelsImg,
  },
  {
    name: "Triggers",
    icon: BellRing,
    kicker: "What makes movement mandatory",
    text: "A trigger converts ‘I could escalate’ into ‘I must.’ Typical tripwires include cost or schedule variance beyond tolerance, material scope change, regulatory exposure, and any safety or ethical concern.",
    note: "A threshold makes the investment decision concrete and unmissable.",
    image: triggersImg,
  },
  {
    name: "Protocols",
    icon: Network,
    kicker: "How information travels",
    text: "Agree on the medium, who needs visibility, and the response time. A critical issue sitting inside a 48-hour silence window is already a governance failure.",
    note: "A route without a communication protocol is only a diagram.",
    image: protocolsImg,
  },
  {
    name: "Resolution",
    icon: RefreshCw,
    kicker: "Where the loop closes",
    text: "Define who decides, how the decision is documented, and how the resolution travels back to the people who raised it. Without that feedback, escalation only creates noise.",
    note: "Tracked resolution restores trust and improves the next decision.",
    image: resolutionImg,
  },
];

const approaches = {
  Predictive: {
    icon: ShieldCheck,
    tag: "FORMAL",
    title: "Structured, documented, hierarchical",
    text: "Issues move through phase gates, change control boards, and written requests. Formal approval chains and investment control points suit complex or regulated projects where the paper trail is protection.",
    path: ["Team", "PM", "CCB", "Sponsor"],
    image: predictiveImg,
  },
  Adaptive: {
    icon: RefreshCw,
    tag: "EMBEDDED",
    title: "Fast feedback inside team rhythm",
    text: "Stand-ups surface blockers quickly; retrospectives reveal systemic issues. Self-governing teams resolve most friction locally, escalating only genuinely high-impact risks.",
    path: ["Stand-up", "Team", "Backlog", "Escalate only if high-impact"],
    image: adaptiveImg,
  },
  Hybrid: {
    icon: GitBranch,
    tag: "DUAL-CHANNEL",
    title: "Two mechanisms, one clear boundary",
    text: "Sprint-level blockers stay with the team while strategic, regulatory, and financial decisions use the formal chain. The PM actively maintains the line between both routes.",
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
  yes: "Right — the threshold hasn’t been crossed. The path exists, but nothing has triggered it.",
  no: "Not quite. The threshold decides whether an issue is eligible to leave the team’s desk; this one hasn’t reached it.",
};
const quiz2 = {
  q: "A hybrid team’s daily blocker keeps getting raised at the monthly steering committee. What’s the real problem?",
  answers: [
    "The committee meets too rarely",
    "The team doesn’t understand the channels",
    "The blocker is too minor to matter",
    "Hybrid projects shouldn’t have steering committees",
  ],
  correct: 1,
  yes: "Exactly. Day-to-day blockers belong in the sprint channel; the formal route is for strategic issues.",
  no: "Look at which channel failed. A team-level blocker was sent into a strategic, monthly-cadence body.",
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
            : `${data.no} Choose another answer to try again.`}
        </motion.p>
      )}
      {picked === data.correct && (
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
                      <p className="eyebrow">
                        LESSON 3.1.3 · THE GOVERNANCE GAP
                      </p>
                      <h1>
                        <span className="headline-line">When nobody knows</span>
                        <br />
                        <em className="headline-line">whose call it is.</em>
                      </h1>
                      <p>
                        Three weeks in, a vendor flags a cost overrun.<br />
                        The technical lead believes it can be absorbed.<br />
                        The sponsor has not been informed. Nobody is wrong.
                      </p>
                      <button
                        className="primary"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "The missing decision map",
                            kicker: "WHY ESCALATION EXISTS",
                            icon: Route,
                            image: governanceGapDrawerImg,
                            text: "Issues aren’t the risk. Every project has them. The real risk is a project that has not decided in advance who owns a problem, how far it can travel before someone else must step in, and where it lands when it does.",
                            note: "Define the owner, the threshold, and the destination before the issue occurs.",
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
                    <p className="eyebrow">TWO TERMS · ONE SYSTEM</p>
                    <h2>
                      The map and the tripwire answer different questions.
                    </h2>
                    <p className="lede">
                      Flip both cards. Mixing these terms is how escalation
                      frameworks fail quietly.
                    </p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "Escalation path",
                          q: "WHO DOES THIS GO TO?",
                          icon: Route,
                          image: escalationPathCard,
                          body: "The pre-agreed route an issue travels: team member → project manager → sponsor → steering committee. Each stop carries more authority than the last.",
                        },
                        {
                          name: "Escalation threshold",
                          q: "WHEN DOES IT LEAVE MY DESK?",
                          icon: BellRing,
                          image: escalationThresholdCard,
                          body: "The specific point — in cost, schedule, exposure, or consequence — where the current owner can no longer absorb an issue and it has to move.",
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
                    <p className="eyebrow">THE FOUR-PART FRAMEWORK</p>
                    <h2>Four moving parts. One closed loop.</h2>
                    <p className="lede">
                      Open each component to build the full system.
                    </p>
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
                    <p className="eyebrow">TAILOR THE ROUTE</p>
                    <h2>Same framework. Different operating rhythm.</h2>
                    <p className="lede">Choose an operating rhythm, then open its story to see how escalation travels.</p>
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
                      <p className="eyebrow">EXAM LENS · CLOSE THE LOOP</p>
                      <h2>
                        Resolve the issue at the <em>lowest level</em> that
                        holds both the authority and the information to decide.
                      </h2>
                      {!done ? (
                        <button
                          className="primary"
                          onClick={() => {
                            setDone(true);
                            tone("success", sound);
                          }}
                        >
                          Reveal the exam rules <Sparkles size={18} />
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <ul>
                            <li>
                              Define paths and thresholds before the crisis.
                            </li>
                            <li>
                              Tailor the route: formal, embedded, or
                              deliberately dual-channel.
                            </li>
                            <li>
                              The sponsor is the PM’s primary escalation point.
                            </li>
                            <li>
                              Resolution flow closes the loop; feedback prevents
                              noise.
                            </li>
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
