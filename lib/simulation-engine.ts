import type { AuditEvent, DemoState, ValidationFinding } from "./types";

export function runDeterministicValidation(state: DemoState): ValidationFinding[] {
  const hasUdi = /UDI:\s*DEMO-UDI-\d{6}/.test(state.draftText);
  const hasBatteryWarning = /Battery:\s*Remove batteries before disposal\./i.test(state.draftText);
  const hasProductCode = /Product Code:\s*CSM-200/.test(state.draftText);
  const hasRequiredWarning = /Warning:\s*Follow the approved device instructions\./.test(state.draftText);
  const hasStorage = /Storage:\s*Refer to the product specification\./.test(state.draftText);
  const checks = [
    { ruleId: "DEMO-FIELD-001", labelId: "LAB-US-DEVICE-EN", check: "Required field completeness", result: hasProductCode && hasStorage ? "PASS" : "FAIL", severity: "Critical", explanation: "Product code and storage text are required in the synthetic label source.", evidence: `Product code ${hasProductCode ? "present" : "missing"}; storage field ${hasStorage ? "present" : "missing"}.`, recommendedAction: "Restore missing required label fields." },
    { ruleId: "DEMO-ID-002", labelId: "LAB-US-DEVICE-EN", check: "Product identifier consistency", result: hasProductCode ? "PASS" : "FAIL", severity: "Critical", explanation: "The label product code must match the active product record.", evidence: "Expected product code: CSM-200.", recommendedAction: "Correct the product code to CSM-200." },
    { ruleId: "DEMO-UDI-003", labelId: "LAB-US-DEVICE-EN", check: "UDI field presence and format", result: hasUdi ? "PASS" : "FAIL", severity: "Critical", explanation: "A synthetic UDI field must match the demo identifier pattern.", evidence: hasUdi ? "DEMO-UDI-000200 format matched." : "No valid DEMO-UDI identifier was found.", recommendedAction: "Restore the synthetic UDI from the approved source." },
    { ruleId: "DEMO-WARN-004", labelId: "LAB-EU-CARTON-DE", check: "Battery disposal warning", result: hasBatteryWarning ? "PASS" : "FAIL", severity: "Critical", explanation: hasBatteryWarning ? "The required synthetic battery disposal wording is present." : "Required warning text is missing from the proposed EU carton label.", evidence: hasBatteryWarning ? "Battery disposal wording found in proposed draft." : "No battery disposal warning found in the proposed draft.", recommendedAction: "Add the approved demo warning wording and rerun validation." },
    { ruleId: "DEMO-WARN-005", labelId: "LAB-US-CARTON-EN", check: "Required general warning", result: hasRequiredWarning ? "PASS" : "FAIL", severity: "Critical", explanation: "The baseline safety warning must remain unchanged.", evidence: hasRequiredWarning ? "Baseline warning text found." : "Baseline warning is missing.", recommendedAction: "Restore the approved baseline warning." },
    { ruleId: "DEMO-SYM-006", labelId: "LAB-EU-CARTON-DE", check: "Required symbol presence", result: "WARNING", severity: "Minor", explanation: "Symbol artwork is represented by a simulated text comparison in this prototype.", evidence: "No physical symbol artwork or barcode inspection was performed.", recommendedAction: "Confirm symbols during authorized artwork review." },
    { ruleId: "DEMO-MKT-007", labelId: "LAB-EU-CARTON-DE", check: "Market-specific rule checks", result: hasBatteryWarning ? "PASS" : "FAIL", severity: "Critical", explanation: "The synthetic market rule requires the battery warning to be present for affected EU carton content.", evidence: "Demo rule DEMO-WARN-004; invented prototype rule, not a regulatory citation.", recommendedAction: "Add the required demo warning and rerun validation." },
    { ruleId: "DEMO-LANG-008", labelId: "LAB-EU-IFU-FR", check: "Language completeness", result: "PASS", severity: "Major", explanation: "All selected languages have a synthetic draft record.", evidence: "English, German, and French variants are listed.", recommendedAction: "No action; verify localized wording with an authorized reviewer." },
    { ruleId: "DEMO-TRAN-009", labelId: "LAB-EU-IFU-FR", check: "Translation review status", result: "NEEDS HUMAN REVIEW", severity: "Major", explanation: "Localized wording has not been verified by a qualified language reviewer.", evidence: "Synthetic translations are not supplied in this demonstration.", recommendedAction: "Complete human translation review before production use." },
    { ruleId: "DEMO-ART-010", labelId: "LAB-US-CARTON-EN", check: "Artwork text comparison", result: "PASS", severity: "Minor", explanation: "Simulated OCR text comparison found no additional differences.", evidence: "Comparison based on synthetic source text, not uploaded artwork.", recommendedAction: "Manually verify final artwork before release." },
  ];

  return checks.map((check, index) => ({
    id: `FND-${String(index + 1).padStart(3, "0")}`,
    ...check,
    result: check.result as ValidationFinding["result"],
    severity: check.severity as ValidationFinding["severity"],
    source: check.ruleId.startsWith("DEMO-WARN") || check.ruleId === "DEMO-MKT-007" ? "Synthetic demo rule library · Revision 1.0" : "Synthetic label specification · Revision 2.2",
  }));
}

export function createAuditEvent(
  state: DemoState,
  eventType: string,
  summary: string,
  previousState: string = state.request.status,
  newState: string = state.request.status,
  entityId = "CSM-200",
  evidenceReference = state.request.id,
): AuditEvent {
  return {
    id: `EVT-${Date.now().toString().slice(-7)}`,
    timestamp: new Date().toISOString(),
    requestId: state.request.id,
    entityId,
    eventType,
    actor: "Demo Regulatory Reviewer",
    previousState,
    newState,
    evidenceReference,
    summary,
  };
}

export function withAudit(state: DemoState, event: AuditEvent): DemoState {
  return { ...state, auditEvents: [event, ...state.auditEvents] };
}
