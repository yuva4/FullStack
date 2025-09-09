// executeCode.js
const fs = require("fs");
const { exec, spawn } = require("child_process");
const { v4: uuid } = require("uuid");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "temp");

// Ensure temp dir exists
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

/**
 * Execute code for multiple languages.
 * - language: "cpp" | "c" | "python" | "java"
 * - code: source code string
 * - input: string to send to stdin
 * - timeoutMs: maximum ms for execution (default 5000)
 */
const executeCode = (language, code, input = "", timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    const id = uuid();
    let srcPath, exePath, compileCmd, runCmdInfo;

    try {
      if (language === "cpp") {
        srcPath = path.join(TEMP_DIR, `${id}.cpp`);
        exePath = path.join(TEMP_DIR, `${id}.exe`);
        fs.writeFileSync(srcPath, code, "utf8");
        compileCmd = `g++ "${srcPath}" -o "${exePath}"`;
        runCmdInfo = { runPath: exePath, args: [] };

      } else if (language === "c") {
        srcPath = path.join(TEMP_DIR, `${id}.c`);
        exePath = path.join(TEMP_DIR, `${id}.exe`);
        fs.writeFileSync(srcPath, code, "utf8");
        compileCmd = `gcc "${srcPath}" -o "${exePath}"`;
        runCmdInfo = { runPath: exePath, args: [] };

      } else if (language === "python") {
        srcPath = path.join(TEMP_DIR, `${id}.py`);
        fs.writeFileSync(srcPath, code, "utf8");
        runCmdInfo = { runPath: "python", args: [srcPath] };

      } else if (language === "java") {
        // NOTE: requires user's class name to be `Main`
        const className = "Main";
        srcPath = path.join(TEMP_DIR, `${className}.java`);
        fs.writeFileSync(srcPath, code, "utf8");
        compileCmd = `javac "${srcPath}" -d "${TEMP_DIR}"`;
        runCmdInfo = { runPath: "java", args: ["-cp", TEMP_DIR, className] };

      } else {
        return reject("❌ Language not supported");
      }
    } catch (fsErr) {
      return reject("Filesystem error: " + fsErr.message);
    }

    // Cleanup temporary files
    const cleanup = () => {
      try {
        if (srcPath && fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
        if (exePath && fs.existsSync(exePath)) fs.unlinkSync(exePath);
        if (language === "java") {
          const classFile = path.join(TEMP_DIR, "Main.class");
          if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
        }
      } catch {
        // ignore cleanup errors
      }
    };

    // Function to run the compiled/interpreted program
    const runProcess = () => {
      const child = spawn(runCmdInfo.runPath, runCmdInfo.args, {
        cwd: TEMP_DIR,
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";
      let finished = false;

      // Kill process if it exceeds timeout
      const killTimer = setTimeout(() => {
        if (!finished) {
          child.kill("SIGKILL");
          finished = true;
          cleanup();
          return reject("⏳ Execution timed out");
        }
      }, timeoutMs);

      child.stdout.on("data", (d) => (stdout += d.toString()));
      child.stderr.on("data", (d) => (stderr += d.toString()));

      child.on("error", (err) => {
        if (finished) return;
        finished = true;
        clearTimeout(killTimer);
        cleanup();
        return reject("Execution error: " + err.message);
      });

      child.on("close", () => {
        if (finished) return;
        finished = true;
        clearTimeout(killTimer);
        cleanup();
        if (stderr && stderr.trim().length > 0) {
          return reject(stderr.trim());
        }
        return resolve(stdout.trim());
      });

      if (input != null && input !== "") {
        child.stdin.write(input.toString());
      }
      child.stdin.end();
    };

    // Compile if needed, else just run
    if (compileCmd) {
      exec(compileCmd, { maxBuffer: 1024 * 1024 }, (cErr, _cOut, cStderr) => {
        if (cErr) {
          cleanup();
          return reject((cStderr || cErr.message).toString());
        }
        runProcess();
      });
    } else {
      runProcess();
    }
  });
};

module.exports = executeCode;
