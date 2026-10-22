# LabelGuard AI

LabelGuard AI is a front-end proof-of-concept for an end-to-end medical device labeling workflow. It demonstrates how a specification change can move through impact analysis, bounded agent tasks, label drafting, deterministic validation, simulated RPA, human review, controlled release, and application-level traceability.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The prototype is designed to run without paid APIs, external credentials, or ERP/PLM access.

## Demonstration workflow

1. Select **Launch interactive demo**.
2. Open **Change Requests** and run impact analysis for CR-1042.
3. Review affected label variants and run the agent workflow.
4. In **Label Studio** or **Validation Center**, inject the missing-warning demo error and run validation. The critical failure blocks approval.
5. Restore the warning, rerun validation, and complete the simulated RPA tasks.
6. Record a reviewer decision in **Review & Approval** and inspect the release gates.
7. Simulate controlled release and review the event history in **Audit Trail**.

**Guided demo** advances the same shared state through the 15-step scenario. Use **Reset** to restore the sample state.

## Scope and safety

- All product, label, market, rule-library, and integration data is synthetic.
- Agent outputs, OCR comparison, barcode checks, RPA actions, human decisions, and release events are simulated in the browser. No external LLM or production system is called.
- The demo rule identifiers are invented and are not regulatory citations. A passing result is not regulatory certification or manufacturing authorization.
- A critical deterministic failure blocks approval and release. Approval requires a reviewer comment and all simulated evidence-routing tasks; release additionally requires explicit reviewer approval.
- Session state is stored in browser local storage. Reset clears the saved simulation state.
- Audit history is application-level traceability, not a certified immutable audit system.

## Deployment

Deploy the project to Vercel using the standard Next.js deployment flow. No environment variables are required for the simulation.
