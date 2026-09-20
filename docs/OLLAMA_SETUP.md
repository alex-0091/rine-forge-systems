# Rine Forge Systems V5 — Local Ollama Setup & Operations Guide

## 1. Introduction

Rine Forge Systems V5 uses **Ollama** as its primary local AI engine. All core business AI operations—conversations, website generation, website auditing, customer reception, and business planning—run locally without sending customer data to commercial cloud providers.

---

## 2. Installation Instructions

### Windows
1. Download the Windows installer from [ollama.com/download/windows](https://ollama.com/download/windows).
2. Run `OllamaSetup.exe` and follow on-screen prompts.
3. Verify installation in PowerShell:
   ```powershell
   ollama --version
   ```

### macOS
1. Download from [ollama.com/download/mac](https://ollama.com/download/mac) or install via Homebrew:
   ```bash
   brew install ollama
   ```

### Linux
1. Run the official automated install script:
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

---

## 3. Starting the Daemon

Rine Forge expects the Ollama HTTP daemon to be listening on `http://localhost:11434`.

To start the daemon manually:
```bash
ollama serve
```

On Windows, Ollama typically runs as a background task in the system tray automatically after installation.

---

## 4. Recommended Model Installation by Hardware Tier

Check your host RAM in Rine Forge Workbench or via Task Manager, then pull the recommended models:

### Tier 1 (< 8 GB RAM)
```bash
ollama pull phi3:mini
ollama pull qwen2:1.5b
```

### Tier 2 (8 - 16 GB RAM) — Recommended for most users
```bash
ollama pull llama3:8b
ollama pull qwen2.5-coder:7b
ollama pull phi3:mini
```

### Tier 3 (16 - 32 GB RAM)
```bash
ollama pull deepseek-coder:6.7b
ollama pull qwen3-coder:latest
ollama pull command-r:35b
```

### Tier 4 (> 32 GB RAM)
```bash
ollama pull llama3:70b
```

---

## 5. Verifying Connection in Rine Forge

1. Open Rine Forge at `http://localhost:5173`.
2. Navigate to **Workbench** → **Hardware & Local AI**.
3. View truthful connection status:
   - **Daemon Status:** `ONLINE` or `OFFLINE`
   - **Host Profiler:** Cores, RAM, GPU, Free Disk Space
   - **Installed Models:** Live list from Ollama
   - **Model Catalog:** One-click safe install with hardware compatibility protection

---

## 6. Troubleshooting

- **Error: "Ollama daemon is offline or unreachable"**:
  Ensure `ollama serve` is running in an active terminal or system tray. Check firewall settings for `localhost:11434`.
- **Error: "Model requires X GB RAM, but detected host memory is Y GB"**:
  Your system RAM is smaller than the model's footprint. Pull a smaller recommended model (e.g. `phi3:mini` or `llama3:8b`), or check `Confirm Risk` if you have sufficient swap/pagefile space.
- **Port Conflicts**:
  If port 11434 is in use by another application, configure `OLLAMA_HOST=127.0.0.1:11435` and set `OLLAMA_BASE_URL=http://localhost:11435` in Rine Forge's `.env`.
