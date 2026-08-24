---
title: "Agent runtime boundaries"
description: "A notes-level model for separating intent, tools, and evidence in an agent loop."
date: 2026-08-20
tags: ["AI Agent", "Engineering Notes"]
draft: false
---

> Note / example: this is a design sketch, not a report of a shipped runtime.

An agent loop becomes easier to reason about when its boundaries are explicit.

## Three useful boundaries

1. Intent is a request, not an execution.
2. A tool call is a candidate action, not proof of success.
3. Evidence belongs to the loop and should be inspectable.

Keeping these layers separate gives an evaluation a place to attach.
