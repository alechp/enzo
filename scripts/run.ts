#!/usr/bin/env bun
/**
 * Enzo Runner — Bun Shell CLI for the Enzo presentation site
 * Zero external dependencies. Run with: bun scripts/run.ts
 */

import { $ } from "bun";
import { createInterface } from "readline";
import { resolve, dirname } from "path";
import { existsSync } from "fs";

// ── ANSI Colors ──────────────────────────────────────────────────────────────

const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  bgCyan: "\x1b[46m",
  bgMagenta: "\x1b[45m",
};

const c = colors;

// ── Types ────────────────────────────────────────────────────────────────────

type Mode = "dev" | "build" | "preview" | "test" | "deps" | "clean" | "typecheck" | "health";

// ── Runner ───────────────────────────────────────────────────────────────────

class EnzoRunner {
  private verbose: boolean;
  private projectRoot: string;

  constructor() {
    this.verbose = process.argv.includes("--verbose");
    this.projectRoot = this.resolveProjectRoot();
  }

  private resolveProjectRoot() {
    const scriptDir = dirname(Bun.main);
    const siblingPackageJson = resolve(scriptDir, "package.json");
    if (existsSync(siblingPackageJson)) {
      return scriptDir;
    }

    return resolve(scriptDir, "..");
  }

  // ── Logging ──────────────────────────────────────────────────────────────

  private log(msg: string) {
    console.log(msg);
  }

  private logStep(msg: string) {
    console.log(`\n  ${c.cyan}${c.bold}>>>${c.reset} ${c.white}${msg}${c.reset}`);
  }

  private logSuccess(msg: string) {
    console.log(`  ${c.green}${c.bold} ✓ ${c.reset} ${c.green}${msg}${c.reset}`);
  }

  private logError(msg: string) {
    console.error(`  ${c.red}${c.bold} ✗ ${c.reset} ${c.red}${msg}${c.reset}`);
  }

  private logWarning(msg: string) {
    console.log(`  ${c.yellow}${c.bold} ! ${c.reset} ${c.yellow}${msg}${c.reset}`);
  }

  private logVerbose(msg: string) {
    if (this.verbose) {
      console.log(`  ${c.gray}${msg}${c.reset}`);
    }
  }

  // ── Banner ───────────────────────────────────────────────────────────────

  private printBanner() {
    const hr = `${c.dim}${c.cyan}${"─".repeat(56)}${c.reset}`;
    console.log();
    console.log(hr);
    console.log(`${c.bold}${c.cyan}
    ███████╗███╗   ██╗███████╗ ██████╗
    ██╔════╝████╗  ██║╚══███╔╝██╔═══██╗
    █████╗  ██╔██╗ ██║  ███╔╝ ██║   ██║
    ██╔══╝  ██║╚██╗██║ ███╔╝  ██║   ██║
    ███████╗██║ ╚████║███████╗╚██████╔╝
    ╚══════╝╚═╝  ╚═══╝╚══════╝ ╚═════╝${c.reset}`);
    console.log();
    console.log(`  ${c.dim}${c.white}AI Video Market & Cost Analysis${c.reset}`);
    console.log(`  ${c.gray}SolidJS · Tailwind · Vite · Bun${c.reset}`);
    console.log(hr);
    console.log();
  }

  // ── Prompt ───────────────────────────────────────────────────────────────

  private prompt(question: string): Promise<string> {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  // ── Environment Validation ───────────────────────────────────────────────

  private async validateEnv() {
    this.logStep("Validating environment");

    const checks: Array<{ name: string; cmd: string[] }> = [
      { name: "bun", cmd: ["bun", "--version"] },
    ];

    for (const { name, cmd } of checks) {
      try {
        const result = await Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" }).exited;
        if (result !== 0) throw new Error();
        this.logVerbose(`${name}: found`);
      } catch {
        this.logError(`${name} is not installed or not in PATH`);
        process.exit(1);
      }
    }

    this.logSuccess("Environment OK");
  }

  // ── Shell Helper ─────────────────────────────────────────────────────────

  private async run(label: string, cmd: string) {
    this.logStep(label);
    this.logVerbose(`$ ${cmd}`);
    const result = await $`sh -c ${cmd}`.cwd(this.projectRoot).nothrow();
    if (result.exitCode !== 0) {
      this.logError(`Command failed (exit ${result.exitCode})`);
      return false;
    }
    this.logSuccess(label);
    return true;
  }

  private async ensureDepsInstalled(context: string) {
    const requiredPath = resolve(this.projectRoot, "node_modules/solid-js/package.json");

    if (!existsSync(requiredPath)) {
      this.logVerbose(`Missing dependencies for ${context}`);
      return this.run("Installing dependencies", "sfw bun install");
    }

    this.logVerbose(`Dependencies OK for ${context}`);
    return true;
  }

  // ── Modes ────────────────────────────────────────────────────────────────

  private async modeDev() {
    await this.validateEnv();
    if (!(await this.ensureDepsInstalled("dev"))) return;
    await this.run("Starting Vite dev server", "bun run dev");
  }

  private async modeBuild() {
    await this.validateEnv();
    if (!(await this.ensureDepsInstalled("build"))) return;
    await this.run("Building for production", "bun run build");
  }

  private async modePreview() {
    await this.validateEnv();

    const distIndex = resolve(this.projectRoot, "dist/index.html");
    if (!existsSync(distIndex)) {
      this.logWarning("No dist/ found — building first");
      if (!(await this.ensureDepsInstalled("preview"))) return;
      if (!(await this.run("Building for production", "bun run build"))) return;
    }

    await this.run("Previewing production build", "bun run preview");
  }

  private async modeTypecheck() {
    await this.validateEnv();
    if (!(await this.ensureDepsInstalled("typecheck"))) return;
    await this.run("Running TypeScript type check", "bunx tsc --noEmit");
  }

  private async modeTest() {
    await this.validateEnv();
    if (!(await this.ensureDepsInstalled("test"))) return;

    const tsc = await this.run("TypeScript type check", "bunx tsc --noEmit");
    const build = await this.run("Verify production build", "bun run build");

    if (tsc && build) {
      this.logSuccess("All checks passed");
    } else {
      this.logError("Some checks failed");
      process.exit(1);
    }
  }

  private async modeDeps() {
    await this.run("Installing dependencies", "sfw bun install");
  }

  private async modeHealth() {
    this.logStep("Health check");

    const packageJson = resolve(this.projectRoot, "package.json");
    if (existsSync(packageJson)) {
      this.logSuccess("package.json found");
    } else {
      this.logError("package.json missing");
    }

    const nodeModules = resolve(this.projectRoot, "node_modules/solid-js/package.json");
    if (existsSync(nodeModules)) {
      this.logSuccess("Dependencies installed");
    } else {
      this.logWarning("Dependencies not installed (run deps)");
    }

    const dist = resolve(this.projectRoot, "dist/index.html");
    if (existsSync(dist)) {
      this.logSuccess("Production build exists");
    } else {
      this.logWarning("No production build (run build)");
    }

    try {
      const resp = await fetch("http://localhost:5173");
      if (resp.ok) {
        this.logSuccess("Dev server running at :5173");
      } else {
        this.logWarning(`Dev server responded ${resp.status}`);
      }
    } catch {
      this.logWarning("Dev server not running");
    }
  }

  private async modeClean() {
    const targets = ["dist", "node_modules", ".turbo"];
    this.logWarning(`This will remove: ${targets.join(", ")}`);
    const answer = await this.prompt(`  ${c.yellow}Continue? [y/N] ${c.reset}`);
    if (answer.toLowerCase() !== "y") {
      this.log(`  ${c.dim}Cancelled.${c.reset}`);
      return;
    }

    for (const dir of targets) {
      const fullPath = resolve(this.projectRoot, dir);
      if (existsSync(fullPath)) {
        await this.run(`Removing ${dir}`, `rm -rf ${dir}`);
      }
    }
    this.logSuccess("Clean complete");
  }

  // ── Help ─────────────────────────────────────────────────────────────────

  private printHelp() {
    this.printBanner();
    console.log(`  ${c.bold}${c.white}Usage:${c.reset}  enzo [options]`);
    console.log();
    console.log(`  ${c.bold}${c.white}Options:${c.reset}`);
    console.log(`    ${c.cyan}--mode=<mode>${c.reset}    Skip menu and run a mode directly`);
    console.log(`    ${c.cyan}--verbose${c.reset}         Show extra output`);
    console.log(`    ${c.cyan}--help${c.reset}            Show this help`);
    console.log();
    console.log(`  ${c.bold}${c.white}Modes:${c.reset}`);
    console.log(`    ${c.green}dev${c.reset}           Start Vite dev server (hot reload)`);
    console.log(`    ${c.green}build${c.reset}         Build for production`);
    console.log(`    ${c.green}preview${c.reset}       Preview production build`);
    console.log(`    ${c.green}typecheck${c.reset}     TypeScript type check`);
    console.log(`    ${c.green}test${c.reset}          Type check + production build`);
    console.log(`    ${c.green}deps${c.reset}          Install dependencies (sfw bun install)`);
    console.log(`    ${c.green}health${c.reset}        Check project state & dev server`);
    console.log(`    ${c.green}clean${c.reset}         Remove dist/, node_modules/`);
    console.log();
    console.log(`  ${c.bold}${c.white}Examples:${c.reset}`);
    console.log(`    ${c.dim}$ ./run${c.reset}                       Interactive menu`);
    console.log(`    ${c.dim}$ ./run --mode=dev${c.reset}            Launch dev server`);
    console.log(`    ${c.dim}$ ./run --mode=build${c.reset}          Production build`);
    console.log(`    ${c.dim}$ ./run --mode=test${c.reset}           Run all checks`);
    console.log();
  }

  // ── Interactive Menu ─────────────────────────────────────────────────────

  private async showMenu(): Promise<Mode | null> {
    const items = [
      { key: "1", mode: "dev" as Mode, label: "Dev Server", desc: "Start Vite dev server (hot reload)" },
      { key: "2", mode: "build" as Mode, label: "Build Production", desc: "Build for production" },
      { key: "3", mode: "preview" as Mode, label: "Preview Build", desc: "Preview production build locally" },
      { key: "4", mode: "typecheck" as Mode, label: "Type Check", desc: "TypeScript type check (tsc --noEmit)" },
      { key: "5", mode: "test" as Mode, label: "Run Tests", desc: "Type check + production build" },
      { key: "6", mode: "deps" as Mode, label: "Install Dependencies", desc: "sfw bun install" },
      { key: "7", mode: "health" as Mode, label: "Health Check", desc: "Check project state & dev server" },
      { key: "8", mode: "clean" as Mode, label: "Clean", desc: "Remove dist/, node_modules/" },
    ];

    for (const item of items) {
      console.log(
        `  ${c.bold}${c.cyan}${item.key})${c.reset} ${c.white}${item.label.padEnd(24)}${c.reset}${c.dim}${item.desc}${c.reset}`
      );
    }
    console.log(`  ${c.bold}${c.cyan}0)${c.reset} ${c.white}Exit${c.reset}`);
    console.log();

    const answer = await this.prompt(`  ${c.magenta}Select [${c.bold}1${c.reset}${c.magenta}]: ${c.reset}`);
    const choice = answer || "1";

    if (choice === "0") return null;
    const found = items.find((i) => i.key === choice);
    if (!found) {
      this.logError(`Invalid selection: ${choice}`);
      return null;
    }
    return found.mode;
  }

  // ── Execute Mode ────────────────────────────────────────────────────────

  private async executeMode(mode: Mode) {
    switch (mode) {
      case "dev":
        return this.modeDev();
      case "build":
        return this.modeBuild();
      case "preview":
        return this.modePreview();
      case "typecheck":
        return this.modeTypecheck();
      case "test":
        return this.modeTest();
      case "deps":
        return this.modeDeps();
      case "health":
        return this.modeHealth();
      case "clean":
        return this.modeClean();
    }
  }

  // ── Entry Point ──────────────────────────────────────────────────────────

  async main() {
    process.on("SIGINT", () => {
      console.log(`\n  ${c.dim}Interrupted. Goodbye.${c.reset}\n`);
      process.exit(0);
    });

    const args = process.argv.slice(2);

    if (args.includes("--help")) {
      this.printHelp();
      return;
    }

    const modeArg = args.find((a) => a.startsWith("--mode="));
    const validModes: Mode[] = ["dev", "build", "preview", "typecheck", "test", "deps", "health", "clean"];

    if (modeArg) {
      const mode = modeArg.split("=")[1] as Mode;
      if (!validModes.includes(mode)) {
        this.logError(`Unknown mode: ${mode}`);
        this.logWarning(`Valid modes: ${validModes.join(", ")}`);
        process.exit(1);
      }
      this.printBanner();
      await this.executeMode(mode);
      return;
    }

    // Interactive menu
    this.printBanner();
    const mode = await this.showMenu();
    if (!mode) {
      this.log(`\n  ${c.dim}Goodbye.${c.reset}\n`);
      return;
    }

    await this.executeMode(mode);
    console.log();
  }
}

// ── Run ──────────────────────────────────────────────────────────────────────

const runner = new EnzoRunner();
runner.main().catch((err) => {
  console.error(`\n  \x1b[31m\x1b[1mFatal:\x1b[0m ${err.message}\n`);
  process.exit(1);
});
