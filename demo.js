// ── Terminal Demo Animations ──

class TerminalDemo {
  constructor(el, lines, opts = {}) {
    this.el = el;
    this.lines = lines;
    this.typeSpeed = opts.typeSpeed || 30;
    this.lineDelay = opts.lineDelay || 400;
    this.outputDelay = opts.outputDelay || 600;
    this.cursor = null;
    this.running = false;
    this.observer = null;
    this.hasPlayed = false;
  }

  init() {
    // Auto-play when scrolled into view
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.hasPlayed) {
          this.hasPlayed = true;
          this.play();
        }
      },
      { threshold: 0.4 }
    );
    this.observer.observe(this.el);

    // Replay button
    const btn = this.el.querySelector(".demo-replay");
    if (btn) {
      btn.addEventListener("click", () => {
        this.play();
      });
    }
  }

  async play() {
    if (this.running) return;
    this.running = true;

    const body = this.el.querySelector(".term-body");
    body.innerHTML = "";

    for (const line of this.lines) {
      if (line.type === "user") {
        await this.typeUserLine(body, line.text);
      } else if (line.type === "output") {
        await this.printOutput(body, line.text, line.className || "");
      } else if (line.type === "pause") {
        await this.sleep(line.ms || 800);
      }
    }

    // Remove cursor at end
    if (this.cursor) this.cursor.remove();
    this.running = false;
  }

  async typeUserLine(body, text) {
    const lineEl = document.createElement("div");
    lineEl.className = "term-line term-user";

    const prompt = document.createElement("span");
    prompt.className = "term-prompt";
    prompt.textContent = "$ ";
    lineEl.appendChild(prompt);

    const content = document.createElement("span");
    content.className = "term-typed";
    lineEl.appendChild(content);

    if (this.cursor) this.cursor.remove();
    this.cursor = document.createElement("span");
    this.cursor.className = "term-cursor";
    this.cursor.textContent = "\u2588";
    lineEl.appendChild(this.cursor);

    body.appendChild(lineEl);
    this.scrollToBottom(body);

    for (const char of text) {
      content.textContent += char;
      this.scrollToBottom(body);
      await this.sleep(this.typeSpeed + Math.random() * 20);
    }

    await this.sleep(this.lineDelay);
  }

  async printOutput(body, text, className) {
    if (this.cursor) this.cursor.remove();
    await this.sleep(this.outputDelay);

    const lines = text.split("\n");
    for (const line of lines) {
      const lineEl = document.createElement("div");
      lineEl.className = "term-line term-output " + className;
      lineEl.textContent = line || "\u00A0";
      body.appendChild(lineEl);
      this.scrollToBottom(body);
      await this.sleep(40);
    }

    await this.sleep(this.lineDelay);
  }

  scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

// ── Demo Scripts ──

const researcherDemo = [
  { type: "user", text: "What approaches exist for discrete action representations in robotics?" },
  { type: "output", text: "Researcher Mode — you're mapping the problem space, not building yet.\n(/switch any time.)", className: "term-accent" },
  { type: "output", text: "[deep-research skill activating]", className: "term-dim" },
  { type: "output", text: "Gate 0: Before I survey, let me scope this:\n\n  Are you focused on a specific modality (vision, actions,\n  joint states)? Or a broad survey across all modalities?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Action representations specifically. VQ-VAE, FSQ, RVQ variants." },
  { type: "output", text: "Got it. Scoping to discrete action representations.\n\nCreating scratch/2026-09-19-discrete-actions/README.md\n\n  ▶ Phase 1: VQ-VAE in robotics\n  ▶ Phase 2: FSQ applications\n  ▶ Phase 3: RVQ in policy learning" },
  { type: "pause", ms: 500 },
  { type: "output", text: "\n◆ Consulting Codex — Gate 1 (findings):\n  \"What should this survey have covered and didn't?\"", className: "term-codex" },
  { type: "output", text: "\nGate 1 — Survey Findings:", className: "term-accent" },
  { type: "output", text: "\n  [claude] 12 relevant papers across 3 approaches. RVQ shows\n          the strongest results for multi-modal actions.\n  [claude] Surprise: FSQ avoids codebook collapse entirely,\n          but has far fewer robotics papers.\n  [codex]  Missed residual-FSQ hybrids — 2 papers, verified,\n          both relevant. Added to the README.\n\n  Two models agreeing here would be weak evidence anyway;\n  the useful part is what Codex found that I missed.\n\n  Open question: compare training stability across methods,\n  or focus on downstream task performance?" },
];

const engineerDemo = [
  { type: "user", text: "I want to add residual vector quantization to the policy network" },
  { type: "output", text: "Engineer Mode — there's something to build, so the full pipeline applies.", className: "term-accent" },
  { type: "output", text: "\nGate 0 — Intake", className: "term-accent" },
  { type: "output", text: "\nBefore I investigate, a few scoping questions:\n\n  Are you replacing the existing VQ layer entirely,\n  or adding RVQ as an alternative alongside it?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Adding as an alternative. Keep VQ working, add RVQ behind a config flag." },
  { type: "output", text: "  What depth for RVQ? Is depth=2 a hard choice, or should\n  it support arbitrary depth via config?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Arbitrary depth, default 4." },
  { type: "output", text: "  Which paper's RVQ formulation? The original Soundstream\n  (Zeghidour et al.) or the VQ-BeT variant with residual FSQ?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Soundstream. Equations 3-5 from the paper." },
  { type: "output", text: "\n◆ Consulting Codex — Gate 0 (scope):\n  \"Is this scope hiding a decision the human hasn't been asked about?\"", className: "term-codex" },
  { type: "pause", ms: 500 },
  { type: "output", text: "\nScope confirmed — with one addition:", className: "term-accent" },
  { type: "output", text: "  Add RVQ as config-gated alternative to existing VQ.\n  Arbitrary depth (default 4). Soundstream formulation (Eq 3-5).\n  Existing VQ behavior must not change.\n\n  [codex] Flagged: \"depth is configurable, but the codebook\n          size per level isn't specified — shared or per-level?\"\n          That's a real gap. Verified: config.py has one\n          codebook_size field.\n\n  Shared codebook across levels, or one per level?\n  This changes what the ablation measures, so it's your call." },
];

const debuggerDemo = [
  { type: "user", text: "Training loss decreases but the policy doesn't learn. Eval reward stays at 0." },
  { type: "output", text: "Debugger Mode — specific wrong behavior with an expectation attached.", className: "term-accent" },
  { type: "output", text: "\nGate 0 — Scoping the Bug", className: "term-accent" },
  { type: "output", text: "\n  When did this start? Was there a recent code change,\n  or has eval reward always been zero?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Since I added the new action head last week. Loss looks fine." },
  { type: "output", text: "Investigating — dispatching in parallel:", className: "term-dim" },
  { type: "output", text: "  ▶ silent-bug-detector      ▶ data-flow-tracer\n  ▶ paper-alignment-auditor  ▶ investigator (gradient path)" },
  { type: "pause", ms: 600 },
  { type: "output", text: "\n◆ Consulting Codex — Gate 4 (diagnosis):\n  \"What else explains this evidence equally well?\"", className: "term-codex" },
  { type: "pause", ms: 500 },
  { type: "output", text: "\n┌─ Bug Classification: CODE BUG ────────────────┐\n│                                             │\n│  [both] action_head.py:47                   │\n│  stop_gradient wraps the encoder output     │\n│  instead of just the codebook lookup.       │\n│                                             │\n│  Evidence: gradient norm at action_head     │\n│  output is exactly 0.0 (should be ~1e-3).   │\n│  Per Soundstream Eq. 4, sg() should only    │\n│  wrap (z_q - z_e).                          │\n│                                             │\n│  [codex · unverified] \"loss.py:210 also     │\n│  detaches\" — loss.py has 140 lines and no   │\n│  detach anywhere. Not treated as a finding. │\n│                                             │\n└────────────────────────────────────────────┘", className: "term-box" },
  { type: "output", text: "\nGate 4: Fix sg(z_q) → z_e + sg(z_q - z_e)?\nThis restores gradients to the encoder while keeping the\ncodebook path detached. I won't touch anything until you say." },
];

const trainerDemo = [
  { type: "user", text: "Kick off make train-large on the cluster" },
  { type: "output", text: "Trainer Mode — the code is settled; this is an execution task.", className: "term-accent" },
  { type: "output", text: "Scanning your project for training commands...", className: "term-dim" },
  { type: "pause", ms: 700 },
  { type: "output", text: "\nTraining Commands Detected:\n\n  Source       Command                          Notes\n  ────────────────────────────────────────────────────────────\n  Makefile     make train-large                 4-GPU DDP\n  Script       python train.py --config ...     Main entry\n\nConfigs: configs/default.yaml, configs/large.yaml\nGPUs: 4x A100, all free (nvidia-smi)\nwandb: configured (project: policy-learning)\n\nBefore I launch — batch size 512 won't fit in 80GB at depth 4.\nMay I reduce it, and if so, what's the floor you'll accept?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Down to 256, no lower. Don't touch anything else." },
  { type: "output", text: "▶ Dispatching trainer-operator (keeps the log out of this session)", className: "term-dim" },
  { type: "output", text: "\nTRAINING STATUS — policy-rvq-d4", className: "term-accent" },
  { type: "output", text: "\n  COMMAND   make train-large BATCH=256\n  SESSION   screen -r propel-train-20260919-1423\n  LOG       logs/propel-train-20260919-1423.log\n  STATE     running\n\n  PRE-FLIGHT   disk 412GB free · config parses · entry imports\n  PROGRESS     step 120/50000  loss 6.41  1.8 it/s\n               first loss 6.41 — plausible for 512-way softmax\n\n  RUNTIME FIXES   batch 512 → 256 (within approved discretion)\n  ESCALATED       none\n\n  WATCH NEXT   loss should drop below 5.0 by step ~2000.\n               If it plateaus at 6.2, that's the codebook\n               collapsing — a logic issue, not a runtime one,\n               and it goes back to you rather than to a patch." },
];

// ── Initialize all demos on page load ──

document.addEventListener("DOMContentLoaded", () => {
  const demos = [
    { id: "demo-researcher", lines: researcherDemo },
    { id: "demo-engineer", lines: engineerDemo },
    { id: "demo-debugger", lines: debuggerDemo },
    { id: "demo-trainer", lines: trainerDemo },
  ];

  demos.forEach(({ id, lines }) => {
    const el = document.getElementById(id);
    if (el) {
      const demo = new TerminalDemo(el, lines);
      demo.init();
    }
  });
});
