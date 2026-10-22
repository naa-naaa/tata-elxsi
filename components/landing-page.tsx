"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, CirclePlay, FileText, GitBranch, Pause, Play, RotateCcw, ShieldCheck, Sparkles, Workflow } from "lucide-react";

const scenes = [
  { title: "The change", label: "NEW REVISION · 2.2", copy: "When a product specification or regulatory requirement changes, every affected label must be identified and reviewed.", icon: FileText, tone: "teal" },
  { title: "Impact analysis", label: "6 VARIANTS IDENTIFIED", copy: "LabelGuard AI analyses the change and identifies the label variants that may be affected.", icon: GitBranch, tone: "blue" },
  { title: "Specialist agents", label: "4 AGENTS WORKING", copy: "Specialized AI agents prepare suggested updates, retrieve approved source information, and check market-specific content.", icon: Sparkles, tone: "purple" },
  { title: "Compliance verification", label: "RULE DEMO-WARN-004", copy: "Deterministic rules and document checks detect missing information, inconsistent identifiers, and artwork differences.", icon: ShieldCheck, tone: "amber" },
  { title: "RPA operations", label: "7 TASKS SIMULATED", copy: "RPA prepares workflow records and routes the supporting evidence through the review process.", icon: Workflow, tone: "blue" },
  { title: "Human approval", label: "REVIEWER DECISION", copy: "Authorized quality and regulatory reviewers evaluate the evidence and make the approval decision.", icon: Check, tone: "green" },
  { title: "Controlled release", label: "REVISION 2.2 · RELEASED", copy: "Only when mandatory checks pass and required approvals are recorded can the label enter the simulated release stage.", icon: ShieldCheck, tone: "teal" },
];

const painPoints = [
  ["01", "Fragmented systems", "Label information is distributed across ERP, PLM, document repositories, and labeling tools."],
  ["02", "Manual updates", "Changes must be propagated across product variants, packaging levels, and markets."],
  ["03", "Compliance risk", "Required identifiers, warnings, symbols, and market content can be missed."],
  ["04", "Localization complexity", "Multilingual labels need controlled translation and terminology checks."],
  ["05", "Weak traceability", "Evidence, decisions, versions, and approvals are difficult to connect."],
];
const features = [
  ["Change impact analysis", "Find affected SKUs, markets, languages, packaging levels, and revisions."],
  ["AI-assisted authoring", "Draft proposed updates from approved synthetic source information."],
  ["Deterministic validation", "Verify required fields, UDI, warnings, symbols, and demo market rules."],
  ["Artwork & OCR comparison", "Compare extracted label text and visual revisions with simulated results."],
  ["RPA workflow automation", "Create change records, attach reports, and route review tasks."],
  ["Traceability & audit", "Connect source changes, findings, decisions, and released revisions."],
];

export function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [captions, setCaptions] = useState(true);
  const currentScene = scenes[scene];
  const SceneIcon = currentScene.icon;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setScene((value) => (value + 1) % scenes.length), 7000);
    return () => window.clearInterval(timer);
  }, [playing]);

  const goScene = (next: number) => setScene((next + scenes.length) % scenes.length);

  return (
    <main className="landing-page">
      <header className="marketing-nav wrap">
        <a className="brand-lockup" href="#top" aria-label="LabelGuard AI home">
          <span className="brand-mark"><ShieldCheck size={21} strokeWidth={2.2} /></span>
          <span><strong>LabelGuard</strong><small>AI · LABEL OPERATIONS</small></span>
        </a>
        <nav className="marketing-links" aria-label="Main navigation">
          <a href="#solution">Platform</a><a href="#explainer">How it works</a><a href="#impact">Impact</a>
        </nav>
        <button className="button button-small button-dark" onClick={onLaunch}>Launch demo <ArrowUpRight size={15} /></button>
      </header>

      <section className="hero-section wrap" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> REGULATED LABELING, REIMAGINED</div>
          <h1>Medical device labeling.<br /><span>Reimagined with</span><br /><em>Agentic AI.</em></h1>
          <p>From specification change to controlled label release — faster, traceable, and human-approved.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={onLaunch}>Launch interactive demo <ArrowRight size={16} /></button>
            <a className="button button-quiet" href="#explainer"><CirclePlay size={17} /> Watch how it works</a>
          </div>
          <div className="hero-tags"><span>Agentic AI</span><span>RPA automation</span><span>Regulatory validation</span><span>Human-in-the-loop</span></div>
        </div>
        <div className="hero-art" aria-label="A synthetic label revision moving through AI review and verification">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-document">
            <div className="doc-top"><span className="doc-logo">CS</span><span className="doc-stamp">REV 2.2<br />DRAFT</span></div>
            <div className="doc-label">CARDIOSENSE<br /><b>MONITOR</b></div>
            <div className="doc-lines"><span /><span /><span className="short" /></div>
            <div className="doc-warning"><span className="warning-triangle">!</span><span>Battery safety<br />warning updated</span></div>
            <div className="doc-bottom"><span>CSM-200</span><span className="barcode">▥ ▥ ▥ ▥ ▥</span></div>
          </div>
          <motion.div className="orchestrator-node" animate={{ y: [0, -7, 0] }} transition={{ duration: 3.2, repeat: Infinity }}>
            <span className="node-icon"><Sparkles size={22} /></span><strong>AI orchestrator</strong><small>Coordinating 6 agents</small>
            <div className="node-pulse"><i /><i /><i /></div>
          </motion.div>
          <div className="agent-pill agent-a"><span className="agent-mini teal-mini"><FileText size={13} /></span>Document intelligence <b>Ready</b></div>
          <div className="agent-pill agent-b"><span className="agent-mini violet-mini"><GitBranch size={13} /></span>Impact analysis <b>6 labels</b></div>
          <div className="agent-pill agent-c"><span className="agent-mini amber-mini"><ShieldCheck size={13} /></span>Rule validation <b>Verified</b></div>
          <div className="verified-chip"><Check size={14} /> Human approval required</div>
          <svg className="hero-connectors" viewBox="0 0 560 470" aria-hidden="true"><path d="M177 138 C248 100 253 156 308 179"/><path d="M177 347 C255 377 250 307 308 279"/><path d="M427 184 C480 147 470 87 505 83"/><path d="M427 278 C482 310 471 374 500 380"/></svg>
          <div className="art-caption"><span className="caption-dot" /> SIMULATED LABEL LIFECYCLE <span>01 — 07</span></div>
        </div>
      </section>

      <section className="trust-strip"><div className="wrap trust-inner"><span>ONE CHANGE CAN TOUCH</span><b>Product variants</b><i /><b>Markets</b><i /><b>Languages</b><i /><b>Packaging levels</b><span className="trust-note">A connected lifecycle, not another silo.</span></div></section>

      <section className="section-block wrap problem-section" id="problem">
        <div className="section-intro"><div className="eyebrow">THE LABELING CHALLENGE</div><h2>One change. Many<br /><span>places it can go wrong.</span></h2><p>A single specification change can affect multiple labels, languages, packaging levels, and markets.</p></div>
        <div className="pain-grid">{painPoints.map(([number, title, copy]) => <article className="pain-card" key={number}><span className="pain-number">{number}</span><h3>{title}</h3><p>{copy}</p><span className="pain-arrow"><ArrowUpRight size={15} /></span></article>)}</div>
      </section>

      <section className="solution-band" id="solution"><div className="wrap solution-inner"><div className="section-intro light-intro"><div className="eyebrow">A CONNECTED APPROACH</div><h2>From change request<br />to <span>controlled release.</span></h2><p>Bounded agent tasks, deterministic rules, RPA assistance, and authorized human decisions — in one traceable workflow.</p><button className="button button-light" onClick={onLaunch}>Explore the simulation <ArrowRight size={16} /></button></div>
        <div className="architecture-flow"><div className="arch-step"><span className="arch-icon"><FileText size={18} /></span><small>01</small><b>Specification<br />change</b></div><span className="flow-arrow">→</span><div className="arch-step arch-highlight"><span className="arch-icon"><Sparkles size={18} /></span><small>02</small><b>AI<br />orchestrator</b><i>6 specialist agents</i></div><span className="flow-arrow">→</span><div className="arch-step"><span className="arch-icon"><ShieldCheck size={18} /></span><small>03</small><b>Deterministic<br />validation</b></div><span className="flow-arrow">→</span><div className="arch-step"><span className="arch-icon"><Workflow size={18} /></span><small>04</small><b>RPA workflow<br />execution</b></div><span className="flow-arrow">→</span><div className="arch-step arch-human"><span className="arch-icon"><Check size={18} /></span><small>05</small><b>Human approval<br />& release</b></div></div>
        <div className="solution-foot"><span>AI suggests. Rules verify. People decide.</span><span>Every step leaves a trace <ArrowRight size={14} /></span></div></div></section>

      <section className="section-block wrap explainer-section" id="explainer"><div className="section-heading-row"><div><div className="eyebrow">THE LIFECYCLE, IN 49 SECONDS</div><h2>See the whole story.</h2></div><p>A short product walkthrough using synthetic records and simulated integrations.</p></div>
        <div className="explainer-frame">
          <div className="explainer-topline"><div className="explainer-label"><span className="live-dot" /> PRODUCT EXPLAINER <span>·</span> SCENE {String(scene + 1).padStart(2, "0")} / 07</div><button className={`caption-toggle ${captions ? "selected" : ""}`} onClick={() => setCaptions((value) => !value)} aria-pressed={captions}>CC Captions {captions ? "On" : "Off"}</button></div>
          <div className="explainer-stage">
            <div className="stage-grid" />
            <AnimatePresence mode="wait"><motion.div key={scene} className={`scene-visual scene-${currentScene.tone}`} initial={{ opacity: 0, y: 15, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .98 }} transition={{ duration: .42 }}>
              <div className="scene-node scene-source"><FileText size={25} /><small>CHANGE SOURCE</small><b>CSM-200 · Rev 2.2</b><span className="revision-tag">NEW REVISION</span></div>
              <div className="scene-line line-one" /><div className="scene-line line-two" />
              <div className="scene-node scene-center"><span className="scene-icon"><SceneIcon size={24} /></span><small>{currentScene.label}</small><b>{currentScene.title}</b><div className="scene-spark"><i /><i /><i /></div></div>
              <div className="scene-labels"><div className="scene-label-card"><span className="scene-mini-icon">US</span><b>Device label</b><small>English · Rev 2.2</small></div><div className="scene-label-card"><span className="scene-mini-icon purple-bg">EU</span><b>Carton label</b><small>German · Rev 2.2</small></div><div className="scene-label-card"><span className="scene-mini-icon amber-bg">EU</span><b>IFU</b><small>French · Rev 2.2</small></div></div>
              <div className="scene-approval"><ShieldCheck size={15} /> REVIEW GATE <b>HUMAN DECISION</b></div>
            </motion.div></AnimatePresence>
            {captions && <div className="scene-caption" aria-live="polite">{currentScene.copy}</div>}
          </div>
          <div className="explainer-controls"><div className="control-group"><button className="round-control" aria-label="Previous scene" onClick={() => goScene(scene - 1)}><ChevronLeft size={18} /></button><button className="play-control" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause explainer" : "Play explainer"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button><button className="round-control" aria-label="Next scene" onClick={() => goScene(scene + 1)}><ChevronRight size={18} /></button><button className="round-control replay-control" aria-label="Replay explainer" onClick={() => { setScene(0); setPlaying(true); }}><RotateCcw size={15} /></button><span className="control-scene-title">{currentScene.title}</span></div><div className="scene-progress" role="progressbar" aria-label="Explainer scene progress" aria-valuenow={scene + 1} aria-valuemin={1} aria-valuemax={7}>{scenes.map((item, index) => <button key={item.title} aria-label={`Go to scene ${index + 1}: ${item.title}`} className={index <= scene ? "progress-segment is-done" : "progress-segment"} onClick={() => goScene(index)} />)}</div><button className="skip-demo" onClick={onLaunch}>Skip to interactive demo <ArrowRight size={15} /></button></div>
        </div>
      </section>

      <section className="feature-section"><div className="wrap"><div className="section-heading-row"><div><div className="eyebrow">ONE PLATFORM, EVERY HANDOFF</div><h2>Built for the details<br />that matter.</h2></div><p>AI handles bounded tasks. Deterministic checks verify critical requirements. Authorized people retain the decision.</p></div><div className="feature-grid">{features.map(([title, copy], index) => <article className="feature-card" key={title}><span className={`feature-number feature-tone-${index % 4}`}>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><ArrowUpRight size={16} className="feature-link" /></article>)}</div></div></section>

      <section className="section-block wrap impact-section" id="impact"><div className="impact-copy"><div className="eyebrow">TARGET BENEFITS TO VALIDATE</div><h2>Less repetition.<br /><span>More confidence.</span></h2><p>Potential benefits are goals to validate in a real workflow — not measured outcomes from this prototype.</p><div className="impact-list"><span><Check size={15} /> Reduced repetitive manual work</span><span><Check size={15} /> Faster change-impact assessment</span><span><Check size={15} /> More consistent label verification</span><span><Check size={15} /> Better evidence and audit traceability</span></div></div><div className="impact-board"><div className="impact-board-head"><span>SIMULATION SNAPSHOT</span><span className="status-pill">DEMO DATA</span></div><div className="impact-stat"><b>06</b><span>impacted variants<br /><small>across 2 markets</small></span><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="impact-stat"><b>03</b><span>languages in scope<br /><small>translation review required</small></span><div className="language-pills"><i>EN</i><i>DE</i><i>FR</i></div></div><div className="impact-board-foot"><span><ShieldCheck size={15} /> Reviewer decision required</span><span>Open simulation <ArrowRight size={13} /></span></div></div></section>

      <section className="sdg-section"><div className="wrap"><div className="eyebrow">POTENTIAL CONTRIBUTION</div><h2>Innovation with purpose.</h2><div className="sdg-grid"><article><span className="sdg-number">03</span><div><b>Good Health and Well-Being</b><p>May support safer device labeling and help reduce avoidable labeling-related risk.</p></div></article><article><span className="sdg-number sdg-nine">09</span><div><b>Industry, Innovation and Infrastructure</b><p>Promotes digital transformation and intelligent automation in regulated manufacturing.</p></div></article><article><span className="sdg-number sdg-twelve">12</span><div><b>Responsible Consumption and Production</b><p>May reduce repetitive rework and unnecessary production of obsolete revisions.</p></div></article></div><p className="sdg-caveat">These are potential contributions only, not certified outcomes.</p></div></section>

      <section className="feasibility-section wrap"><div><div className="eyebrow">A PRACTICAL STARTING POINT</div><h2>Designed to prove<br />the workflow first.</h2></div><div className="feasibility-columns"><article><h3>Feasibility</h3><p>Start with synthetic labels and controlled demo rules. Simulate document comparison, RPA, and enterprise connectors before integrating real systems.</p></article><article><h3>Built with safeguards</h3><p>Versioned requirements, confidence-aware OCR, deterministic checks, qualified human review, and an application-level event history.</p></article></div></section>

      <section className="final-cta"><div className="wrap cta-inner"><div className="eyebrow">THE COMPLETE LABEL LIFECYCLE</div><h2>Ready to see a labeling change<br />move to controlled release?</h2><p>Interactive proof of concept using synthetic product data and simulated integrations.</p><button className="button button-light" onClick={onLaunch}>Start simulation <ArrowRight size={16} /></button></div></section>
      <footer className="marketing-footer wrap"><a className="brand-lockup" href="#top"><span className="brand-mark"><ShieldCheck size={18} /></span><span><strong>LabelGuard</strong><small>AI · LABEL OPERATIONS</small></span></a><p>Prototype Simulation · Synthetic Data · Human Approval Required</p><a href="#top">Back to top <ArrowDown size={13} /></a></footer>
    </main>
  );
}
