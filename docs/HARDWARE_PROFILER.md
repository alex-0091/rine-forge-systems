# Rine Forge Systems V5 — Hardware Profiler Architecture

## 1. Purpose

The Hardware Profiler (`backend/app/workbench/hardware_profiler.py`) inspects the host runtime environment dynamically to ensure AI workloads match physical hardware capabilities. It eliminates guesswork and fake performance claims.

---

## 2. Detection Subsystems

### 2.1 CPU & Architecture Profiling
- **Logical & Physical Cores:** Detected via `psutil.cpu_count(logical=True)` and `psutil.cpu_count(logical=False)`.
- **Clock Speed:** Frequency metrics sampled via `psutil.cpu_freq()`.
- **Architecture:** Detected via Python's standard `platform.machine()` (e.g. `AMD64`, `arm64`).

### 2.2 System Memory (RAM)
- **Total Physical RAM:** Sampled in bytes and converted to normalized GB (`psutil.virtual_memory().total / (1024**3)`).
- **Available RAM:** Real-time unallocated RAM (`psutil.virtual_memory().available`).
- **Memory Pressure:** Percentage utilization tracked to avoid scheduling large models when host is under load.

### 2.3 GPU & Dedicated VRAM
- **Windows Runtime:** Probes WMI `Win32_VideoController` and DirectX adapter properties to identify device name, vendor (`NVIDIA`, `AMD`, `Intel`, `Apple`), and Dedicated Video Memory (VRAM) in GB.
- **Linux/Unix Runtime:** Probes `nvidia-smi` or `rocm-smi` when present.
- **Fallback:** If integrated graphics are present with dynamic shared memory (e.g. Intel UHD Graphics 620), accurately reports 1.0 GB dedicated VRAM and defers to system RAM sizing.

### 2.4 Storage Capacity
- **Volume Inspection:** Checks disk partition hosting Rine Forge and Ollama model caches via `psutil.disk_usage("/")`.
- Ensures sufficient disk space before initiating large model pulls (e.g. 4-8 GB free space check).

### 2.5 Ollama Daemon & Binary Health
- **Binary Detection:** Executes `shutil.which("ollama")` to determine if the CLI binary is installed on the host system PATH.
- **Service Verification:** Sends an HTTP `GET` request to `http://localhost:11434/api/version` with a 2-second timeout.
- **Truthful Status Reporting:**
  - `installed`: `true` / `false`
  - `reachable`: `true` / `false`
  - `version`: Version string (e.g. `0.3.12`) or `None` if offline.

---

## 3. Normalized Capabilities Schema

The profiler outputs a unified JSON schema consumed by both the backend router and frontend workbench UI:

```json
{
  "cpu": "Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz",
  "cpuCores": 8,
  "ramGB": 7.85,
  "gpu": {
    "vendor": "Intel",
    "model": "Intel(R) UHD Graphics 620",
    "vramGB": 1.0
  },
  "diskGB": 99.39,
  "architecture": "AMD64",
  "ollama": {
    "installed": false,
    "reachable": false,
    "version": null
  }
}
```

---

## 4. Hardware Tier Categorization

Based on normalized `ramGB`:
- **Tier 1:** `< 8.0 GB RAM` → Lightweight models (`phi3:mini`, `qwen2:1.5b`)
- **Tier 2:** `8.0 - 16.0 GB RAM` → Balanced models (`llama3:8b`, `qwen2.5-coder:7b`)
- **Tier 3:** `16.0 - 32.0 GB RAM` → Heavy models (`command-r:35b`, `deepseek-coder:6.7b`)
- **Tier 4:** `> 32.0 GB RAM` → Large models (`llama3:70b`, `deepseek-v2:236b`)
