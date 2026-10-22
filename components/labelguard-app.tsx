"use client";

import { useCallback, useEffect, useState } from "react";
import { LandingPage } from "@/components/landing-page";
import { Workspace } from "@/components/workspace";
import { createInitialState, createRpaTasks, sampleLabelText } from "@/lib/demo-data";
import { createAuditEvent, runDeterministicValidation } from "@/lib/simulation-engine";
import type { ChangeRequest, DemoState, ViewId } from "@/lib/types";

const STORAGE_KEY = "labelguard-demo-v1";
const proposedDraft = `${sampleLabelText}\nBattery: Remove batteries before disposal. Follow local disposal guidance.`;

export function LabelGuardApp() {
  const [state, setState] = useState<DemoState>(() => createInitialState());
  const [demoOpen, setDemoOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<DemoState>;
          if (parsed.request && parsed.labels && parsed.auditEvents) {
            setState({ ...createInitialState(), ...parsed });
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Browser storage can be unavailable in private browsing; the in-memory demo remains usable.
    }
  }, [ready, state]);

  const navigate = useCallback((view: ViewId) => {
    setState((previous) => ({ ...previous, activeView: view }));
  }, []);

  const reset = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(createInitialState());
    setDemoOpen(true);
  }, []);

  const action = useCallback((name: string, payload?: unknown) => {
    setState((previous) => {
      switch (name) {
        case "update-request": {
          const partial = payload as Partial<ChangeRequest>;
          return { ...previous, request: { ...previous.request, ...partial } };
        }
        case "toggle-market": {
          const market = payload as string;
          const markets = previous.request.markets.includes(market)
            ? previous.request.markets.filter((value) => value !== market)
            : [...previous.request.markets, market];
          return { ...previous, request: { ...previous.request, markets } };
        }
        case "toggle-language": {
          const language = payload as string;
          const languages = previous.request.languages.includes(language)
            ? previous.request.languages.filter((value) => value !== language)
            : [...previous.request.languages, language];
          return { ...previous, request: { ...previous.request, languages } };
        }
        case "guided-create": {
          const next = { ...previous, request: { ...previous.request, status: "Draft" as const } };
          return { ...next, auditEvents: [createAuditEvent(next, "Change request created", "CR-1042 specification change confirmed for the guided demonstration.", previous.request.status, "Draft"), ...next.auditEvents] };
        }
        case "run-impact": {
          const next = { ...previous, request: { ...previous.request, status: "Impact Analysis" as const }, selectedLabelIds: previous.labels.map((label) => label.id), activeView: "impact" as const };
          return { ...next, auditEvents: [createAuditEvent(next, "Impact analysis completed", `${next.labels.length} synthetic label variants identified across ${next.request.markets.length} markets.`, previous.request.status, "Impact Analysis"), ...next.auditEvents] };
        }
        case "toggle-label": {
          const labelId = payload as string;
          const selectedLabelIds = previous.selectedLabelIds.includes(labelId)
            ? previous.selectedLabelIds.filter((id) => id !== labelId)
            : [...previous.selectedLabelIds, labelId];
          return { ...previous, selectedLabelIds };
        }
        case "select-all-labels": {
          const ids = payload as string[];
          const allSelected = ids.every((id) => previous.selectedLabelIds.includes(id));
          const selectedLabelIds = allSelected
            ? previous.selectedLabelIds.filter((id) => !ids.includes(id))
            : Array.from(new Set([...previous.selectedLabelIds, ...ids]));
          return { ...previous, selectedLabelIds };
        }
        case "generate-drafts": {
          const selected = previous.selectedLabelIds;
          const labels = previous.labels.map((label) => selected.includes(label.id) ? { ...label, proposedContent: previous.draftText, status: "Draft generated" } : label);
          const next = { ...previous, labels, request: { ...previous.request, status: "Drafting" as const }, activeView: "labels" as const };
          return { ...next, auditEvents: [createAuditEvent(next, "Draft generated", `Draft Rev ${next.request.targetRevision} prepared for ${selected.length} selected label variants.`, previous.request.status, "Drafting"), ...next.auditEvents] };
        }
        case "run-agents": {
          const next = { ...previous, agentRun: true, activeView: "agents" as const };
          return { ...next, auditEvents: [createAuditEvent(next, "Agent workflow completed", "Six bounded agent tasks completed with simulated, deterministic outputs.", previous.request.status, previous.request.status), ...next.auditEvents] };
        }
        case "update-draft": {
          const draftText = String(payload ?? "").slice(0, 5000);
          const hasWarning = /Battery:\s*Remove batteries before disposal\./i.test(draftText);
          const next = { ...previous, draftText, errorInjected: !hasWarning, validationHasRun: false, request: { ...previous.request, status: "Remediation Required" as const } };
          return next;
        }
        case "correct-draft": {
          const next = { ...previous, draftText: proposedDraft, errorInjected: false, validationHasRun: false, request: { ...previous.request, status: "Remediation Required" as const }, activeView: "labels" as const };
          return { ...next, auditEvents: [createAuditEvent(next, "Label corrected", "Restored the required synthetic battery disposal wording to the proposed draft.", previous.request.status, "Remediation Required"), ...next.auditEvents] };
        }
        case "inject-error": {
          const draftText = previous.errorInjected
            ? previous.draftText.includes("Battery:") ? previous.draftText : proposedDraft
            : previous.draftText.split("\n").filter((line) => !line.toLowerCase().startsWith("battery:")).join("\n");
          const errorInjected = !previous.errorInjected;
          const next = { ...previous, draftText, errorInjected, validationHasRun: false, request: { ...previous.request, status: errorInjected ? "Remediation Required" as const : "Drafting" as const } };
          return { ...next, auditEvents: [createAuditEvent(next, errorInjected ? "Demo error injected" : "Demo error removed", errorInjected ? "Removed the battery disposal warning to demonstrate a critical validation failure." : "Restored the synthetic battery disposal warning to the draft.", previous.request.status, next.request.status), ...next.auditEvents] };
        }
        case "revert-draft": {
          const next = { ...previous, draftText: proposedDraft, errorInjected: false, validationHasRun: false, request: { ...previous.request, status: "Drafting" as const } };
          return { ...next, auditEvents: [createAuditEvent(next, "Draft reverted", "Proposed content restored from the approved synthetic source.", previous.request.status, "Drafting"), ...next.auditEvents] };
        }
        case "save-draft": {
          const next = { ...previous, labels: previous.labels.map((label) => previous.selectedLabelIds.includes(label.id) ? { ...label, proposedContent: previous.draftText } : label) };
          return { ...next, auditEvents: [createAuditEvent(next, "Draft saved", "Proposed label text saved to the local simulation session.", previous.request.status, previous.request.status), ...next.auditEvents] };
        }
        case "run-validation": {
          const findings = runDeterministicValidation(previous);
          const hasCriticalFailure = findings.some((finding) => finding.severity === "Critical" && finding.result === "FAIL");
          const next = { ...previous, findings, validationHasRun: true, activeView: "validation" as const, request: { ...previous.request, status: hasCriticalFailure ? "Remediation Required" as const : "Ready for Review" as const } };
          return { ...next, auditEvents: [createAuditEvent(next, hasCriticalFailure ? "Validation failed" : "Validation passed", `${findings.filter((finding) => finding.result === "PASS").length} checks passed; ${findings.filter((finding) => finding.result === "FAIL").length} critical failures; translation review remains open.`, previous.request.status, next.request.status, "CSM-200 Rev 2.2", "VAL-CR-1042"), ...next.auditEvents] };
        }
        case "update-comment":
          return { ...previous, reviewerComment: String(payload ?? "").slice(0, 500) };
        case "approve":
        case "approve-guided": {
          const comment = name === "approve-guided" ? "Reviewed synthetic evidence and approved the corrected draft for simulated controlled release." : previous.reviewerComment.trim();
          const canApprove = previous.validationHasRun && !previous.findings.some((finding) => finding.severity === "Critical" && finding.result === "FAIL") && previous.rpaTasks.every((task) => task.status === "Completed") && comment.length > 0;
          if (!canApprove) return { ...previous, activeView: "review" };
          const timestamp = new Date().toISOString();
          const decision = { id: `DEC-${Date.now().toString().slice(-6)}`, requestId: previous.request.id, reviewer: "Demo Regulatory Reviewer", decision: "Approved" as const, comment, timestamp };
          const next = { ...previous, reviewDecision: decision, reviewerComment: comment, request: { ...previous.request, status: "Approved" as const }, activeView: name === "approve-guided" ? "review" as const : previous.activeView };
          return { ...next, auditEvents: [createAuditEvent(next, "Reviewer approved", comment, previous.request.status, "Approved", "CSM-200 Rev 2.2", decision.id), ...next.auditEvents] };
        }
        case "reject":
        case "request-changes": {
          if (!previous.reviewerComment.trim() || previous.reviewDecision) return previous;
          const decisionName = name === "reject" ? "Rejected" as const : "Changes Requested" as const;
          const next = { ...previous, reviewDecision: { id: `DEC-${Date.now().toString().slice(-6)}`, requestId: previous.request.id, reviewer: "Demo Regulatory Reviewer", decision: decisionName, comment: previous.reviewerComment.trim(), timestamp: new Date().toISOString() }, request: { ...previous.request, status: decisionName }, activeView: name === "request-changes" ? "labels" as const : previous.activeView };
          return { ...next, auditEvents: [createAuditEvent(next, name === "reject" ? "Reviewer rejected" : "Changes requested", previous.reviewerComment.trim(), previous.request.status, decisionName), ...next.auditEvents] };
        }
        case "start-rpa": {
          if (previous.rpaRunning || previous.rpaTasks.every((task) => task.status === "Completed") || previous.rpaTasks.some((task) => task.status === "Failed")) return { ...previous, activeView: "rpa" };
          const first = previous.rpaTasks.findIndex((task) => task.status === "Queued");
          if (first < 0) return { ...previous, activeView: "rpa" };
          const tasks = previous.rpaTasks.map((task, index) => index === first ? { ...task, status: "Running" as const, startTime: new Date().toISOString(), outputMessage: "Executing simulated action", logs: [...task.logs, `Starting: ${task.action} → ${task.targetSystem}`] } : task);
          return { ...previous, rpaTasks: tasks, rpaRunning: true, rpaPaused: false, activeView: "rpa" };
        }
        case "rpa-step": {
          const currentIndex = previous.rpaTasks.findIndex((task) => task.status === "Running");
          if (currentIndex < 0) return { ...previous, rpaRunning: false };
          const task = previous.rpaTasks[currentIndex];
          if (previous.injectTaskFailure && task.id === "RPA-003") {
            const tasks = previous.rpaTasks.map((item, index) => index === currentIndex ? { ...item, status: "Failed" as const, duration: "0.8s", outputMessage: "Simulated connector timeout", logs: [...item.logs, "ERROR: Simulated PLM connector timed out. No duplicate record created."] } : item);
            const next = { ...previous, rpaTasks: tasks, injectTaskFailure: false, rpaRunning: false, request: { ...previous.request, status: "RPA Failure" as const } };
            return { ...next, auditEvents: [createAuditEvent(next, "RPA task failed", `${task.id} failed with a simulated connector timeout. Retry can resume without duplicate record creation.`, previous.request.status, "RPA Failure", task.id), ...next.auditEvents] };
          }
          const tasks = previous.rpaTasks.map((item, index) => index === currentIndex ? { ...item, status: "Completed" as const, duration: "0.8s", outputMessage: "Completed in simulated environment", logs: [...item.logs, `SUCCESS: ${item.action} completed in ${item.targetSystem}.`] } : item);
          const nextIndex = tasks.findIndex((item) => item.status === "Queued");
          if (nextIndex >= 0) {
            tasks[nextIndex] = { ...tasks[nextIndex], status: "Running", startTime: new Date().toISOString(), outputMessage: "Executing simulated action", logs: [...tasks[nextIndex].logs, `Starting: ${tasks[nextIndex].action} → ${tasks[nextIndex].targetSystem}`] };
            return { ...previous, rpaTasks: tasks };
          }
          const next = { ...previous, rpaTasks: tasks, rpaRunning: false, rpaPaused: false, request: { ...previous.request, status: previous.request.status === "RPA Failure" ? "Ready for Review" as const : previous.request.status } };
          return { ...next, auditEvents: [createAuditEvent(next, "RPA workflow completed", "All seven simulated RPA tasks completed; evidence is attached to the review queue.", previous.request.status, next.request.status, "CSM-200 Rev 2.2", "RPA-CR-1042"), ...next.auditEvents] };
        }
        case "pause-rpa":
          return { ...previous, rpaRunning: false, rpaPaused: true };
        case "resume-rpa": {
          const tasks = previous.rpaTasks.some((task) => task.status === "Running") ? previous.rpaTasks : previous.rpaTasks.map((task) => task.status === "Queued" ? { ...task, status: "Running" as const, startTime: new Date().toISOString(), logs: [...task.logs, `Resuming: ${task.action}`] } : task);
          return { ...previous, rpaTasks: tasks, rpaRunning: true, rpaPaused: false };
        }
        case "retry-rpa": {
          const failedIndex = previous.rpaTasks.findIndex((task) => task.status === "Failed");
          if (failedIndex < 0) return previous;
          const tasks = previous.rpaTasks.map((task, index) => index === failedIndex ? { ...task, status: "Running" as const, retryCount: task.retryCount + 1, startTime: new Date().toISOString(), outputMessage: "Retrying without duplicating the underlying record", logs: [...task.logs, "RETRY: Resuming failed task; idempotent change record check passed."] } : task);
          return { ...previous, rpaTasks: tasks, rpaRunning: true, rpaPaused: false, request: { ...previous.request, status: "Ready for Review" as const } };
        }
        case "inject-rpa-failure":
          return { ...previous, injectTaskFailure: true };
        case "cancel-rpa":
          return { ...previous, rpaRunning: false, rpaPaused: false, rpaTasks: previous.rpaTasks.map((task) => task.status === "Queued" ? { ...task, status: "Canceled", outputMessage: "Canceled by reviewer" } : task) };
        case "reset-rpa":
          return { ...previous, rpaTasks: createRpaTasks(), rpaRunning: false, rpaPaused: false, injectTaskFailure: false };
        case "clear-rpa-logs":
          return { ...previous, rpaTasks: previous.rpaTasks.map((task) => ({ ...task, logs: [] })) };
        case "complete-rpa-guided": {
          const tasks = previous.rpaTasks.map((task) => ({ ...task, status: "Completed" as const, startTime: new Date().toISOString(), duration: "0.8s", outputMessage: "Completed in guided simulation", logs: [...task.logs, `GUIDED DEMO: ${task.action} completed in ${task.targetSystem}.`] }));
          const next = { ...previous, rpaTasks: tasks, rpaRunning: false, rpaPaused: false, activeView: "rpa" as const };
          return { ...next, auditEvents: [createAuditEvent(next, "RPA workflow completed", "All seven simulated RPA tasks completed in guided walkthrough mode.", previous.request.status, previous.request.status, "CSM-200 Rev 2.2", "RPA-CR-1042"), ...next.auditEvents] };
        }
        case "release": {
          const ready = previous.validationHasRun && !previous.findings.some((finding) => finding.severity === "Critical" && finding.result === "FAIL") && previous.rpaTasks.every((task) => task.status === "Completed") && previous.reviewDecision?.decision === "Approved";
          if (!ready || previous.releaseRecord) return { ...previous, activeView: "release" };
          const releaseRecord = { id: `REL-${Date.now().toString().slice(-6)}`, requestId: previous.request.id, labelRevision: previous.request.targetRevision, validationStatus: "Passed", approvalReference: previous.reviewDecision?.id ?? "", releaseStatus: "Simulated release", timestamp: new Date().toISOString() };
          const next = { ...previous, releaseRecord, request: { ...previous.request, status: "Released" as const }, activeView: "release" as const };
          return { ...next, auditEvents: [createAuditEvent(next, "Controlled release simulated", `Rev ${releaseRecord.labelRevision} released in simulation. No production system was updated.`, previous.request.status, "Released", "CSM-200 Rev 2.2", releaseRecord.id), ...next.auditEvents] };
        }
        case "export-audit": {
          if (typeof window !== "undefined") {
            const rows = ["Event ID,Timestamp,Change Request,Product or Label,Event Type,Actor,Previous State,New State,Evidence Reference,Summary", ...previous.auditEvents.map((event) => [event.id, event.timestamp, event.requestId, event.entityId, event.eventType, event.actor, event.previousState, event.newState, event.evidenceReference, event.summary].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))];
            const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "labelguard-audit-trail.csv";
            link.click();
            URL.revokeObjectURL(url);
          }
          return previous;
        }
        case "start-guided":
          return { ...previous, guidedDemo: true, guidedStep: 0, activeView: "changes" };
        case "finish-guided":
          return { ...previous, guidedDemo: false };
        default:
          if (name === "view-label") return { ...previous, activeView: "labels" };
          if (name === "view-source") return { ...previous, activeView: "changes" };
          return previous;
      }
    });
  }, []);

  const setGuidedStep = useCallback((step: number) => {
    setState((previous) => ({ ...previous, guidedStep: Math.max(0, Math.min(14, step)) }));
  }, []);

  return demoOpen ? <Workspace state={state} onNavigate={navigate} onAction={action} onReset={reset} onGuidedStep={setGuidedStep} /> : <LandingPage onLaunch={() => { setDemoOpen(true); navigate("overview"); }} />;
}
