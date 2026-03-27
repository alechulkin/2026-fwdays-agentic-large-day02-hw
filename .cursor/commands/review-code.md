---
description: "Run full AI code review with scoring and actionable fix suggestions"
globs: "**/*.{ts,tsx,js,jsx}"
---

# Command: Review Code

## Context

This command performs a full senior-level code review of the selected code or diff.

## Instructions

When this command is triggered:

1. Analyze the provided code (or git diff if available)
2. Perform a structured review across:
   - Correctness (bugs)
   - Security
   - Performance
   - Code quality
   - Architecture
3. Identify all relevant issues
4. Suggest concrete fixes for each issue
5. Assign scores per category (1–10)
6. Provide a final verdict

## Output Format (MANDATORY)

### Summary

- Short overall assessment (2–4 sentences)

### Issues

For each issue:

- **Type**: Bug | Security | Performance | Quality | Architecture
- **Severity**: Low | Medium | High | Critical
- **Location**: file + line (if available)
- **Description**: What is wrong
- **Impact**: Why it matters
- **Fix**: Concrete fix (code snippet or clear instruction)

### Scores

- Correctness: X/10
- Security: X/10
- Performance: X/10
- Code Quality: X/10
- Architecture: X/10

### Verdict

- APPROVE
- REQUEST_CHANGES
- COMMENT

## Behavior Rules

- Do NOT approve code with unresolved Medium+ issues
- Always provide actionable fixes (no vague feedback)
- Prioritize high-impact issues over style
- Be concise but precise
- Think like a senior engineer reviewing production code

## Optional Enhancement (if diff is provided)

- Focus only on changed lines
- Detect regressions
- Highlight breaking changes

## How to verify

1. **Command execution**
   - Run `/review-code` on a file or diff
   - Ensure output follows the required structure

2. **Output structure**
   - Must include: Summary, Issues, Scores, Verdict
   - Missing section → failure

3. **Issue completeness**
   - Each issue must include:
     - Type
     - Severity
     - Location (file + line when available)
     - Description
     - Impact
     - Fix
   - Missing any field → invalid review

4. **Scoring integrity**
   - Scores must reflect actual issues
   - Critical issue in a category → that category's score must be ≤5

5. **Verdict logic**
   - APPROVE → no unresolved Medium+ issues
   - REQUEST_CHANGES → any unresolved Medium+ issue exists
   - COMMENT → only Low-severity / minor improvements, no blocking issues

6. **Fix quality**
   - Each issue includes a concrete fix (code or clear instruction)
   - No vague suggestions

7. **Security coverage**
   - Check common vulnerability classes:
     - Input validation
     - Injection risks
     - Secrets exposure

8. **Architecture awareness**
   - Module boundaries respected
   - No forbidden dependencies introduced (per project rules)

## Example usage

- `/review-code` on selected file
- `/review-code` on PR diff
