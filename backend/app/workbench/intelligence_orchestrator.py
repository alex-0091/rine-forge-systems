"""
Rine Forge Systems V5 - Phase AQ/AS5: AI Business Workbench Intelligence Orchestrator
Bridges the Workbench API endpoints directly to the master Forge Intelligence Fabric.
Preserves complete backward compatibility for Phase AQ/AR/AS endpoints while leveraging
the full 25-task, 21-agent, 18-tool, self-repairing intelligence architecture.
"""
from backend.app.ai.fabric import (
    ForgeIntelligenceOrchestrator,
    FabricRequest,
    FabricExecutionResponse,
    forge_orchestrator,
    TaskClassifier,
    IntentEngine,
    ExecutionPlanner,
    AgentRegistry,
    ForgeToolRegistry,
    ToolPermissionEngine,
    KnowledgeRouter,
    ContextBuilder,
    ForgeVerifier,
    ArtifactEngine,
    ForgeProjectMemory,
    HumanApprovalGate,
    BusinessToAICompanyEngine,
    AIEmployeeGeneratorEngine,
    SimulationEngine,
    ForgeEventBus,
    ResourceGovernor
)

# Alias for backwards compatibility
FabricVerificationResult = Dict = dict

__all__ = [
    "ForgeIntelligenceOrchestrator",
    "FabricRequest",
    "FabricExecutionResponse",
    "forge_orchestrator",
    "TaskClassifier",
    "IntentEngine",
    "ExecutionPlanner",
    "AgentRegistry",
    "ForgeToolRegistry",
    "ToolPermissionEngine",
    "KnowledgeRouter",
    "ContextBuilder",
    "ForgeVerifier",
    "ArtifactEngine",
    "ForgeProjectMemory",
    "HumanApprovalGate",
    "BusinessToAICompanyEngine",
    "AIEmployeeGeneratorEngine",
    "SimulationEngine",
    "ForgeEventBus",
    "ResourceGovernor"
]
