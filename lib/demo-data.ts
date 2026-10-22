import type { AuditEvent, DemoState, LabelVariant, RpaTask } from "./types";

export const sampleLabelText = `CardioSense Monitor\nProduct Code: CSM-200\nUDI: DEMO-UDI-000200\nWarning: Follow the approved device instructions.\nStorage: Refer to the product specification.\nManufacturer: Example Medical Devices Ltd. (fictional)`;

const proposedText = `${sampleLabelText}\nBattery: Remove batteries before disposal. Follow local disposal guidance.`;

export const sampleLabels: LabelVariant[] = [
  { id: "LAB-US-DEVICE-EN", productCode: "CSM-200", labelType: "Device label", market: "United States", language: "English", currentRevision: "2.1", proposedRevision: "2.2", currentContent: sampleLabelText, proposedContent: proposedText, impactReason: "Battery handling and disposal warning appears on device-level labeling.", riskLevel: "High", status: "Impacted" },
  { id: "LAB-US-CARTON-EN", productCode: "CSM-200", labelType: "Carton label", market: "United States", language: "English", currentRevision: "2.1", proposedRevision: "2.2", currentContent: sampleLabelText, proposedContent: proposedText, impactReason: "Outer carton carries required safety and disposal information.", riskLevel: "High", status: "Impacted" },
  { id: "LAB-EU-CARTON-DE", productCode: "CSM-200", labelType: "Carton label", market: "European Union", language: "German", currentRevision: "2.1", proposedRevision: "2.2", currentContent: sampleLabelText, proposedContent: proposedText, impactReason: "EU carton warning requires approved German translation review.", riskLevel: "High", status: "Impacted" },
  { id: "LAB-EU-IFU-FR", productCode: "CSM-200", labelType: "Instructions for Use", market: "European Union", language: "French", currentRevision: "2.1", proposedRevision: "2.2", currentContent: sampleLabelText, proposedContent: proposedText, impactReason: "Instructions for Use references battery handling and disposal.", riskLevel: "Medium", status: "Impacted" },
  { id: "LAB-US-IFU-EN", productCode: "CSM-200", labelType: "Instructions for Use", market: "United States", language: "English", currentRevision: "2.1", proposedRevision: "2.2", currentContent: sampleLabelText, proposedContent: proposedText, impactReason: "English source text requires a controlled terminology check.", riskLevel: "Medium", status: "Impacted" },
  { id: "LAB-EU-DEVICE-DE", productCode: "CSM-200", labelType: "Device label", market: "European Union", language: "German", currentRevision: "2.1", proposedRevision: "2.2", currentContent: sampleLabelText, proposedContent: proposedText, impactReason: "Device label shares the updated battery handling content.", riskLevel: "Low", status: "Impacted" },
];

export const createRpaTasks = (): RpaTask[] => [
  ["Retrieve approved source documents", "Document Repository"],
  ["Create change record", "PLM"],
  ["Attach impact-analysis report", "PLM"],
  ["Attach validation report", "Document Repository"],
  ["Create regulatory review task", "Regulatory Review Queue"],
  ["Update simulated workflow status", "Label Management System"],
  ["Record task outcome", "ERP"],
].map(([action, targetSystem], index) => ({
  id: `RPA-${String(index + 1).padStart(3, "0")}`,
  action,
  targetSystem,
  status: "Queued",
  retryCount: 0,
  outputMessage: "Waiting to run",
  logs: [],
}));

const seedAudit: AuditEvent[] = [
  { id: "EVT-0003", timestamp: "2026-10-22T09:42:00.000Z", requestId: "CR-1042", entityId: "CSM-200", eventType: "Source revision received", actor: "Demo PLM Connector", previousState: "Rev 2.1", newState: "Rev 2.2", evidenceReference: "SRC-SPEC-220", summary: "Synthetic specification revision received for the CardioSense Monitor family." },
  { id: "EVT-0002", timestamp: "2026-10-22T09:37:00.000Z", requestId: "CR-1042", entityId: "CSM-200", eventType: "Change request created", actor: "Regulatory Reviewer", previousState: "—", newState: "Draft", evidenceReference: "CR-1042", summary: "Battery safety warning update opened for impact assessment." },
  { id: "EVT-0001", timestamp: "2026-10-22T09:35:00.000Z", requestId: "CR-1042", entityId: "CSM-200", eventType: "Simulation initialized", actor: "LabelGuard AI", previousState: "—", newState: "Demo Mode", evidenceReference: "DEMO-SESSION", summary: "Synthetic demonstration workspace initialized. No production systems are connected." },
];

export const createInitialState = (): DemoState => ({
  activeView: "overview",
  request: {
    id: "CR-1042",
    title: "Revise battery safety warning",
    description: "The updated product specification requires revised battery handling and disposal wording.",
    changeType: "Product specification update",
    productFamily: "CardioSense Monitor",
    priority: "High",
    markets: ["United States", "European Union"],
    languages: ["English", "German", "French"],
    sourceRevision: "2.1",
    targetRevision: "2.2",
    status: "Draft",
    createdAt: "2026-10-22T09:37:00.000Z",
    createdBy: "Regulatory Reviewer",
  },
  labels: sampleLabels,
  selectedLabelIds: sampleLabels.map((label) => label.id),
  draftText: proposedText,
  errorInjected: false,
  validationHasRun: false,
  findings: [],
  agentRun: false,
  rpaTasks: createRpaTasks(),
  rpaRunning: false,
  rpaPaused: false,
  injectTaskFailure: false,
  reviewerComment: "",
  reviewDecision: null,
  releaseRecord: null,
  auditEvents: seedAudit,
  guidedDemo: false,
  guidedStep: 0,
  simulationStartedAt: "2026-10-22T09:35:00.000Z",
});
