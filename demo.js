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
  { type: "user", text: "/intro" },
  { type: "output", text: "Welcome to Propel. How do you want to work today?\n\n  1. Researcher    2. Engineer    3. Debugger    4. Trainer" },
  { type: "pause", ms: 600 },
  { type: "user", text: "1" },
  { type: "output", text: "Researcher Mode active.", className: "term-accent" },
  { type: "output", text: "Active skills: investigation, deep-research, paper-extraction,\nthink-deeply, retrospective, context-hygiene.\nActive gates: Gate 0 (Intake), Gate 1 (Post-Investigation).\n\nWhat's the research question driving this session?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "What approaches exist for discrete representation learning in robotics?" },
  { type: "output", text: "[deep-research skill activating]", className: "term-dim" },
  { type: "output", text: "Gate 0: Before I survey, let me scope this:\n\n  Are you focused on a specific modality (vision, actions,\n  joint states)? Or a broad survey across all modalities?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Action representations specifically. VQ-VAE, FSQ, RVQ variants." },
  { type: "output", text: "Got it. Scoping to discrete action representations.\n\nStarting structured literature survey...\nCreating scratch/2026-03-21-discrete-actions/README.md\n\nPhase 1: Searching for VQ-VAE in robotics...\nPhase 2: Searching for FSQ applications...\nPhase 3: Searching for RVQ in policy learning..." },
  { type: "output", text: "\nGate 1 \u2014 Survey Findings:", className: "term-accent" },
  { type: "output", text: "\n  Found 12 relevant papers across 3 approaches.\n  Key finding: RVQ shows strongest results for\n  multi-modal action distributions (BeT, VQ-BeT).\n\n  Surprise: FSQ (finite scalar quantization) avoids\n  codebook collapse entirely but has fewer robotics papers.\n\n  Open question: Should I compare training stability\n  across methods, or focus on downstream task performance?" },
];

const engineerDemo = [
  { type: "user", text: "I want to add residual vector quantization to the policy network" },
  { type: "output", text: "Gate 0 \u2014 Intake", className: "term-accent" },
  { type: "output", text: "\nBefore I investigate, a few scoping questions:\n\n  Are you replacing the existing VQ layer entirely,\n  or adding RVQ as an alternative alongside it?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Adding as an alternative. Keep VQ working, add RVQ behind a config flag." },
  { type: "output", text: "  What depth for RVQ? Is depth=2 a hard choice, or should\n  it support arbitrary depth via config?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Arbitrary depth, default 4." },
  { type: "output", text: "  Which paper's RVQ formulation? The original Soundstream\n  (Zeghidour et al.) or the VQ-BeT variant with residual FSQ?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Soundstream. Equations 3-5 from the paper." },
  { type: "output", text: "\nScope confirmed:", className: "term-accent" },
  { type: "output", text: "  Add RVQ as config-gated alternative to existing VQ.\n  Arbitrary depth (default 4). Soundstream formulation (Eq 3-5).\n  Existing VQ behavior must not change.\n\nProceeding to Questioner Q0..." },
  { type: "output", text: "\n  Q0: Is there an existing RVQ implementation I should\n  use as reference? A repo or file to study?" },
];

const debuggerDemo = [
  { type: "user", text: "/switch debugger" },
  { type: "output", text: "Debugger Mode active.", className: "term-accent" },
  { type: "output", text: "All auditors available for diagnosis.\nI'll classify every issue with solid evidence.\n\nWhat's going wrong?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Training loss decreases but the policy doesn't learn. Eval reward stays at 0." },
  { type: "output", text: "Gate 0 \u2014 Scoping the Bug", className: "term-accent" },
  { type: "output", text: "\n  When did this start? Was there a recent code change,\n  or has eval reward always been zero?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Since I added the new action head last week. Loss looks fine." },
  { type: "output", text: "Investigating...", className: "term-dim" },
  { type: "output", text: "  \u25B6 Dispatching silent-bug-detector...\n  \u25B6 Dispatching data-flow-tracer...\n  \u25B6 Dispatching paper-alignment-auditor..." },
  { type: "pause", ms: 600 },
  { type: "output", text: "\nGate 1 \u2014 Investigation Findings:", className: "term-accent" },
  { type: "output", text: "  silent-bug-detector found: action output is\n  detached from gradient graph at action_head.py:47\n  (stop_gradient applied to encoder output, not just codebook)" },
  { type: "output", text: "\n\u250C\u2500 Bug Classification: CODE BUG \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502                                             \u2502\n\u2502  File: action_head.py:47                    \u2502\n\u2502  Issue: stop_gradient wraps encoder output   \u2502\n\u2502  instead of just the codebook lookup.         \u2502\n\u2502                                             \u2502\n\u2502  Evidence: gradient norm at action_head       \u2502\n\u2502  output is exactly 0.0 (should be ~1e-3).    \u2502\n\u2502                                             \u2502\n\u2502  Root cause: Line 47 applies sg() to the     \u2502\n\u2502  full quantized output. Per Soundstream       \u2502\n\u2502  Eq. 4, sg() should only wrap (z_q - z_e).  \u2502\n\u2502                                             \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518", className: "term-box" },
  { type: "output", text: "\nGate 4: Fix sg(z_q) \u2192 z_e + sg(z_q - z_e)?\nThis restores gradients to the encoder while keeping\nthe codebook path detached. Shall I apply?" },
];

const trainerDemo = [
  { type: "user", text: "/switch trainer" },
  { type: "output", text: "Trainer Mode active.", className: "term-accent" },
  { type: "output", text: "Scanning your project for training commands..." },
  { type: "pause", ms: 800 },
  { type: "output", text: "\nTraining Commands Detected:\n\n  Source       Command                          Notes\n  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n  Script       python train.py --config ...     Main entry\n  Makefile     make train-large                 4-GPU DDP\n\nConfigs: configs/default.yaml, configs/large.yaml\nGPUs: 4x A100 (nvidia-smi)\nwandb: configured (project: policy-learning)\n\nWhich command should I launch?" },
  { type: "pause", ms: 500 },
  { type: "user", text: "Launch make train-large" },
  { type: "output", text: "Launching in screen session...", className: "term-dim" },
  { type: "output", text: "\nTraining launched in screen: propel-train-20260321-1423", className: "term-accent" },
  { type: "output", text: "\n  Attach:  screen -r propel-train-20260321-1423\n  Detach:  Ctrl+A, then D\n  Kill:    screen -X -S propel-train-20260321-1423 quit\n\nI'll monitor the first 100 steps for errors.\nTip: Have you verified checkpointing is enabled?\nIf training crashes without a checkpoint, you lose everything." },
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
