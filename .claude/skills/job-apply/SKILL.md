---
name: job-apply
description: >
  Full job-application optimization pipeline. Takes a job description (file or inline text),
  runs an HR/ATS review, applies improvements to cv-data.js, saves a versioned copy to
  cv-versions/, regenerates all locale content translations, saves the formatted job
  description to the version folder, stamps a // @job-application marker into the live
  cv-data.js + locale files, and logs the application in cv-versions/applications.md.
  Dispatches job-apply-orchestrator to coordinate all steps.
version: 1.0.0
author: Viktor Bozzay
disable-model-invocation: true
argument-hint: "<job-description-file | \"inline job description text\">"
---

# job-apply — Full Job Application CV Pipeline

Triggers the complete job-application optimization workflow.

```
Agent: job-apply-orchestrator
```

Pass the argument (job description file path or inline text) directly to the orchestrator.
