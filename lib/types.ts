export type ViewId =
  | "overview"
  | "changes"
  | "impact"
  | "agents"
  | "labels"
  | "validation"
  | "artwork"
  | "rpa"
  | "review"
  | "release"
  | "audit"
  | "settings";

export type WorkflowStatus =
  | "Draft"
  | "Impact Analysis"
  | "Drafting"
  | "Validation"
  | "Remediation Required"
  | "Ready for Review"
  | "Approved"
  | "Released"
  | "Rejected"
  | "Changes Requested"
  | "RPA Failure"
  | "Validation Blocked";

export type RiskLevel = "Low" | "Medium" | "High";
export type FindingResult = "PASS" | "WARNING" | "FAIL" | "NEEDS HUMAN REVIEW";
export type TaskStatus = "Queued" | "Running" | "Completed" | "Failed" | "Canceled";

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  changeType: string;
  productFamily: string;
  priority: string;
  markets: string[];
  languages: string[];
  sourceRevision: string;
  targetRevision: string;
  status: WorkflowStatus;
  createdAt: string;
  createdBy: string;
}

export interface LabelVariant {
  id: string;
  productCode: string;
  labelType: string;
  market: string;
  language: string;
  currentRevision: string;
  proposedRevision: string;
  currentContent: string;
  proposedContent: string;
  impactReason: string;
  riskLevel: RiskLevel;
  status: string;
}

export interface ValidationFinding {
  id: string;
  ruleId: string;
  labelId: string;
  check: string;
  severity: "Critical" | "Major" | "Minor";
  result: FindingResult;
  explanation: string;
  evidence: string;
  source: string;
  recommendedAction: string;
}

export interface RpaTask {
  id: string;
  action: string;
  targetSystem: string;
  status: TaskStatus;
  startTime?: string;
  duration?: string;
  retryCount: number;
  outputMessage: string;
  logs: string[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  requestId: string;
  entityId: string;
  eventType: string;
  actor: string;
  previousState: string;
  newState: string;
  evidenceReference: string;
  summary: string;
}

export interface ReviewDecision {
  id: string;
  requestId: string;
  reviewer: string;
  decision: "Approved" | "Rejected" | "Changes Requested";
  comment: string;
  timestamp: string;
}

export interface ReleaseRecord {
  id: string;
  requestId: string;
  labelRevision: string;
  validationStatus: string;
  approvalReference: string;
  releaseStatus: string;
  timestamp: string;
}

export interface DemoState {
  activeView: ViewId;
  request: ChangeRequest;
  labels: LabelVariant[];
  selectedLabelIds: string[];
  draftText: string;
  errorInjected: boolean;
  validationHasRun: boolean;
  findings: ValidationFinding[];
  agentRun: boolean;
  rpaTasks: RpaTask[];
  rpaRunning: boolean;
  rpaPaused: boolean;
  injectTaskFailure: boolean;
  reviewerComment: string;
  reviewDecision: ReviewDecision | null;
  releaseRecord: ReleaseRecord | null;
  auditEvents: AuditEvent[];
  guidedDemo: boolean;
  guidedStep: number;
  simulationStartedAt: string;
}
