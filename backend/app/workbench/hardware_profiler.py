"""
Rine Forge Systems V5 - Server-Side Hardware Profiler & Local AI Engine Discovery
Truthfully inspects host architecture, CPU, RAM, GPU, VRAM, and storage without external dependencies.
Probes local Ollama instance for live connectivity and installed open models.
Categorizes server hardware into 4 capability tiers with model recommendations.
"""
import os
import platform
import shutil
import subprocess
import logging
import time
import ctypes
from typing import Dict, Any, List, Optional
import httpx

from backend.app.config import settings

logger = logging.getLogger("rine_forge.workbench.hardware_profiler")


class HardwareProfiler:
    """
    Authoritative hardware and local model discovery engine.
    Detects server capacity to advise on optimal model parameter sizes.
    """

    @staticmethod
    def detect_ram() -> Dict[str, float]:
        """Detects total and available physical RAM in GB across Windows, Linux, and macOS."""
        total_gb = 0.0
        avail_gb = 0.0
        sys_name = platform.system()

        try:
            if sys_name == "Windows":
                class MEMORYSTATUSEX(ctypes.Structure):
                    _fields_ = [
                        ('dwLength', ctypes.c_ulong),
                        ('dwMemoryLoad', ctypes.c_ulong),
                        ('ullTotalPhys', ctypes.c_ulonglong),
                        ('ullAvailPhys', ctypes.c_ulonglong),
                        ('ullTotalPageFile', ctypes.c_ulonglong),
                        ('ullAvailPageFile', ctypes.c_ulonglong),
                        ('ullTotalVirtual', ctypes.c_ulonglong),
                        ('ullAvailVirtual', ctypes.c_ulonglong),
                        ('ullAvailExtendedVirtual', ctypes.c_ulonglong),
                    ]
                stat = MEMORYSTATUSEX()
                stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
                if ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat)):
                    total_gb = round(stat.ullTotalPhys / (1024 ** 3), 2)
                    avail_gb = round(stat.ullAvailPhys / (1024 ** 3), 2)
            elif sys_name == "Linux" and os.path.exists("/proc/meminfo"):
                with open("/proc/meminfo", "r") as f:
                    lines = f.readlines()
                mem_dict = {}
                for line in lines:
                    parts = line.split(":")
                    if len(parts) == 2:
                        key = parts[0].strip()
                        val = parts[1].strip().split()[0]
                        mem_dict[key] = int(val)
                total_kb = mem_dict.get("MemTotal", 0)
                avail_kb = mem_dict.get("MemAvailable", mem_dict.get("MemFree", 0))
                total_gb = round(total_kb / (1024 ** 2), 2)
                avail_gb = round(avail_kb / (1024 ** 2), 2)
            elif sys_name == "Darwin":
                # macOS sysctl
                out = subprocess.check_output(["sysctl", "-n", "hw.memsize"], text=True)
                total_bytes = int(out.strip())
                total_gb = round(total_bytes / (1024 ** 3), 2)
                avail_gb = round(total_gb * 0.4, 2)  # Conservative estimate
        except Exception as e:
            logger.warning(f"Error detecting RAM: {e}")
            total_gb = 8.0
            avail_gb = 4.0

        return {"total_gb": total_gb, "available_gb": avail_gb}

    @staticmethod
    def detect_gpu() -> Dict[str, Any]:
        """Detects GPU presence, vendor, model, and VRAM in GB."""
        # 1. Try nvidia-smi
        nvidia_smi = shutil.which("nvidia-smi")
        if nvidia_smi:
            try:
                cmd = [
                    nvidia_smi,
                    "--query-gpu=name,memory.total,memory.free,driver_version",
                    "--format=csv,noheader,nounits"
                ]
                res = subprocess.run(cmd, capture_output=True, text=True, timeout=3)
                if res.returncode == 0 and res.stdout.strip():
                    line = res.stdout.strip().split("\n")[0]
                    parts = [p.strip() for p in line.split(",")]
                    if len(parts) >= 3:
                        name = parts[0]
                        total_mb = float(parts[1])
                        free_mb = float(parts[2])
                        driver = parts[3] if len(parts) > 3 else "Unknown"
                        return {
                            "gpu_detected": True,
                            "vendor": "NVIDIA",
                            "model": name,
                            "vram_total_gb": round(total_mb / 1024, 2),
                            "vram_free_gb": round(free_mb / 1024, 2),
                            "driver_version": driver
                        }
            except Exception as e:
                logger.debug(f"nvidia-smi query failed: {e}")

        # 2. Try torch.cuda if available
        try:
            import torch  # type: ignore
            if torch.cuda.is_available():
                name = torch.cuda.get_device_name(0)
                props = torch.cuda.get_device_properties(0)
                vram_gb = round(props.total_memory / (1024 ** 3), 2)
                return {
                    "gpu_detected": True,
                    "vendor": "CUDA",
                    "model": name,
                    "vram_total_gb": vram_gb,
                    "vram_free_gb": vram_gb,
                    "driver_version": torch.version.cuda
                }
        except Exception:
            pass

        # 3. Windows wmic / powershell fallback for integrated / AMD / Intel
        if platform.system() == "Windows":
            try:
                cmd = ["powershell", "-NoProfile", "-Command", "Get-CimInstance Win32_VideoController | Select-Object -First 1 Name, AdapterRAM | ConvertTo-Json"]
                res = subprocess.run(cmd, capture_output=True, text=True, timeout=4)
                if res.returncode == 0 and res.stdout.strip():
                    import json
                    data = json.loads(res.stdout)
                    name = data.get("Name", "Integrated Display Device")
                    ram_bytes = data.get("AdapterRAM") or 0
                    vram_gb = round(ram_bytes / (1024 ** 3), 2) if ram_bytes else 0.0
                    return {
                        "gpu_detected": True,
                        "vendor": "System GPU",
                        "model": name,
                        "vram_total_gb": vram_gb,
                        "vram_free_gb": vram_gb,
                        "driver_version": "N/A"
                    }
            except Exception:
                pass

        return {
            "gpu_detected": False,
            "vendor": "None",
            "model": "CPU Only",
            "vram_total_gb": 0.0,
            "vram_free_gb": 0.0,
            "driver_version": "N/A"
        }

    @staticmethod
    def detect_storage() -> Dict[str, float]:
        """Detects root disk storage capacity in GB."""
        try:
            total, used, free = shutil.disk_usage(".")
            return {
                "total_gb": round(total / (1024 ** 3), 2),
                "free_gb": round(free / (1024 ** 3), 2),
                "used_gb": round(used / (1024 ** 3), 2)
            }
        except Exception:
            return {"total_gb": 0.0, "free_gb": 0.0, "used_gb": 0.0}

    def get_hardware_profile(self) -> Dict[str, Any]:
        """Aggregates all host hardware specs truthfully."""
        ram = self.detect_ram()
        gpu = self.detect_gpu()
        storage = self.detect_storage()
        cpu_cores = os.cpu_count() or 4
        processor = platform.processor() or "Generic x86_64"

        tier = self.classify_hardware_tier(
            ram_total_gb=ram["total_gb"],
            vram_gb=gpu["vram_total_gb"],
            cpu_cores=cpu_cores
        )

        return {
            "os": f"{platform.system()} {platform.release()} ({platform.machine()})",
            "system_name": platform.node(),
            "cpu_cores": cpu_cores,
            "processor": processor,
            "ram": ram,
            "gpu": gpu,
            "storage": storage,
            "tier": tier
        }

    @staticmethod
    def classify_hardware_tier(ram_total_gb: float, vram_gb: float, cpu_cores: int) -> Dict[str, Any]:
        """
        Classifies host capacity into 4 tiers to recommend verified open model architectures:
        - Tier 1: Low-Resource (<8GB RAM, no GPU)
        - Tier 2: Consumer (8-16GB RAM, or 4-6GB VRAM)
        - Tier 3: Workstation (16-32GB RAM, 8-16GB VRAM)
        - Tier 4: Server-Class (>32GB RAM, >16GB VRAM)
        """
        effective_mem = max(ram_total_gb, vram_gb * 1.5)

        if effective_mem < 8.0:
            return {
                "tier_number": 1,
                "tier_name": "Tier 1: Low-Resource",
                "badge": "LOW_RESOURCE",
                "recommended_parameter_size": "1B - 3B",
                "recommended_quantization": "Q4_K_M",
                "recommended_models": [
                    {"name": "phi3:mini", "size": "3.8B", "purpose": "General Reasoning & Planning"},
                    {"name": "qwen2:1.5b", "size": "1.5B", "purpose": "Fast Chat & Triage"}
                ],
                "max_context_window": 4096,
                "notes": "Optimal for lightweight CPU inference. Highly responsive for triage and quick drafting."
            }
        elif effective_mem < 16.0:
            return {
                "tier_number": 2,
                "tier_name": "Tier 2: Consumer",
                "badge": "CONSUMER_STANDARD",
                "recommended_parameter_size": "7B - 8B",
                "recommended_quantization": "Q4_K_M",
                "recommended_models": [
                    {"name": "llama3:8b", "size": "8B", "purpose": "Balanced Business Intelligence & Strategy"},
                    {"name": "mistral:7b", "size": "7.2B", "purpose": "High-Quality Copywriting & Synthesis"}
                ],
                "max_context_window": 8192,
                "notes": "Standard production tier. Runs 8B parameter models with excellent fidelity."
            }
        elif effective_mem < 32.0:
            return {
                "tier_number": 3,
                "tier_name": "Tier 3: Workstation",
                "badge": "WORKSTATION_PRO",
                "recommended_parameter_size": "8B - 14B",
                "recommended_quantization": "Q5_K_M / Q8_0",
                "recommended_models": [
                    {"name": "llama3.1:8b", "size": "8B", "purpose": "Advanced 128k Context Reasoning"},
                    {"name": "qwen2.5:14b", "size": "14B", "purpose": "Complex Analysis & Financial Modeling"},
                    {"name": "deepseek-coder:6.7b", "size": "6.7B", "purpose": "Code & Website Generation"}
                ],
                "max_context_window": 16384,
                "notes": "High capacity workstation. Capable of running 14B models with extended context."
            }
        else:
            return {
                "tier_number": 4,
                "tier_name": "Tier 4: Server-Class",
                "badge": "ENTERPRISE_SERVER",
                "recommended_parameter_size": "32B - 70B",
                "recommended_quantization": "Q4_K_M / FP16",
                "recommended_models": [
                    {"name": "llama3:70b", "size": "70B", "purpose": "Commercial Frontier Enterprise Intelligence"},
                    {"name": "qwen2.5:32b", "size": "32B", "purpose": "High-Fidelity Code & Autonomous Planning"}
                ],
                "max_context_window": 32768,
                "notes": "Enterprise server with massive memory bandwidth for 32B+ models."
            }

    @staticmethod
    async def check_ollama_status() -> Dict[str, Any]:
        """
        Probes local Ollama instance for connectivity, latency, version, and installed models.
        Truthfully returns OFFLINE if unreachable.
        """
        base_url = getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        start_time = time.perf_counter()
        ollama_bin_installed = shutil.which("ollama") is not None

        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.get(f"{base_url}/api/tags")
                latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

                version = "unknown"
                try:
                    vres = await client.get(f"{base_url}/api/version")
                    if vres.status_code == 200:
                        version = vres.json().get("version", "unknown")
                except Exception:
                    pass

                if res.status_code == 200:
                    data = res.json()
                    models_raw = data.get("models", [])
                    models = []
                    for m in models_raw:
                        size_bytes = m.get("size", 0)
                        size_gb = round(size_bytes / (1024 ** 3), 2)
                        models.append({
                            "name": m.get("name"),
                            "model": m.get("model"),
                            "size_gb": size_gb,
                            "modified_at": m.get("modified_at"),
                            "digest": m.get("digest", "")[:12]
                        })

                    return {
                        "is_installed": ollama_bin_installed,
                        "is_reachable": True,
                        "status": "AVAILABLE",
                        "endpoint": base_url,
                        "version": version,
                        "latency_ms": latency_ms,
                        "models_count": len(models),
                        "installed_models": models,
                        "instructions": "Ollama local engine is online and operational."
                    }
                else:
                    return {
                        "is_installed": ollama_bin_installed,
                        "is_reachable": False,
                        "status": "ERROR",
                        "endpoint": base_url,
                        "version": None,
                        "latency_ms": latency_ms,
                        "error": f"Ollama returned HTTP status {res.status_code}",
                        "models_count": 0,
                        "installed_models": [],
                        "instructions": f"Check Ollama service logs. HTTP {res.status_code} received."
                    }
        except Exception as e:
            return {
                "is_installed": ollama_bin_installed,
                "is_reachable": False,
                "status": "OFFLINE",
                "endpoint": base_url,
                "version": None,
                "latency_ms": None,
                "error": str(e),
                "models_count": 0,
                "installed_models": [],
                "instructions": (
                    f"Ollama is offline or unreachable at {base_url}. "
                    "Start Ollama locally with 'ollama serve' to activate zero-cost local neural models."
                )
            }

    async def get_normalized_capabilities(self) -> Dict[str, Any]:
        """
        Returns a normalized capability object for internal ModelRouter consumption:
        {
            cpu, cpuCores, ramGB,
            gpu: { vendor, model, vramGB },
            diskGB, architecture,
            ollama: { installed, reachable, version }
        }
        """
        ram = self.detect_ram()
        gpu = self.detect_gpu()
        storage = self.detect_storage()
        cpu_cores = os.cpu_count() or 4
        processor = platform.processor() or "Generic CPU"
        ollama = await self.check_ollama_status()

        return {
            "cpu": processor,
            "cpuCores": cpu_cores,
            "ramGB": ram["total_gb"],
            "gpu": {
                "vendor": gpu["vendor"],
                "model": gpu["model"],
                "vramGB": gpu["vram_total_gb"]
            },
            "diskGB": storage["total_gb"],
            "architecture": platform.machine(),
            "ollama": {
                "installed": ollama.get("is_installed", False),
                "reachable": ollama.get("is_reachable", False),
                "version": ollama.get("version")
            }
        }

    async def get_full_system_profile(self) -> Dict[str, Any]:
        """Unifies hardware detection, tier classification, and Ollama probe."""
        hardware = self.get_hardware_profile()
        ollama = await self.check_ollama_status()

        return {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "hardware": hardware,
            "ollama": ollama,
            "overall_status": "READY" if ollama["is_reachable"] else "CONFIGURATION_REQUIRED",
            "is_local_inference_ready": ollama["is_reachable"] and ollama["models_count"] > 0
        }

    @staticmethod
    async def trigger_pull_model(model_name: str) -> Dict[str, Any]:
        """
        Triggers asynchronous pull/download of a model into Ollama.
        """
        base_url = getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{base_url}/api/pull", json={"name": model_name, "stream": False})
                if res.status_code == 200:
                    return {
                        "status": "SUCCESS",
                        "model": model_name,
                        "message": f"Model '{model_name}' successfully installed or verified in local Ollama."
                    }
                else:
                    return {
                        "status": "FAILED",
                        "model": model_name,
                        "error": f"Ollama pull returned status {res.status_code}: {res.text}"
                    }
        except Exception as e:
            return {
                "status": "OFFLINE",
                "model": model_name,
                "error": f"Cannot connect to Ollama at {base_url}: {str(e)}"
            }


hardware_profiler = HardwareProfiler()
