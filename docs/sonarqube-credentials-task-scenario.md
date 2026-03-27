# Task scenario: SonarQube credentials in the repository

## What was requested

1. **First message:** Create and commit a file containing SonarQube credentials, with username `achulkin`.
2. **Follow-up:** The same, but including an explicit password in the request.

The intent was to store SonarQube authentication material in the Git repository so it could be versioned and shared with the project.

## Feedback (assistant response)

### Why the request was not fulfilled as asked

- **Secrets must not live in Git.** Passwords, tokens, and similar values belong in environment variables, secret managers, or CI/CD secret stores—not in committed files. That matches this repository’s security rules and common industry practice.
- **Risk:** Anyone with read access to the repo, plus forks, clones, backups, and sometimes logs, can obtain committed credentials. Rotating them later does not fully erase them from history without a deliberate cleanup.
- **SonarQube practice:** Analysis is usually authenticated with a **user token**, not by committing a username/password pair. Tokens can be scoped and revoked independently.

### Recommended alternatives

| Context        | Approach |
|----------------|----------|
| **CI/CD**      | Configure `SONAR_TOKEN` (and `SONAR_HOST_URL` if needed) as encrypted secrets; pass them into `sonar-scanner` or the official Sonar integration. |
| **Local runs** | Use OS environment variables or a **gitignored** local file (e.g. `.env.local` patterns already used in this project). Never commit the file that holds the real token or password. |
| **Repo**       | Commit only non-secret configuration, e.g. `sonar-project.properties` with `sonar.projectKey`, sources, exclusions—**without** `sonar.login` or passwords. |

### If a password was shared in chat

Any password (or token) typed into a chat should be treated as **potentially exposed**: rotate it in SonarQube and use a new secret only through secure channels going forward.

## Outcome

No credentials file was created or committed. This document records the scenario and the rationale for anyone reviewing the decision later.
