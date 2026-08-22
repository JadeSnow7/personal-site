---
title: "Rust at the boundary"
description: "A small example of using types to make invalid runtime configuration harder to express."
date: 2026-08-15
tags: ["Rust", "Engineering Notes"]
draft: false
---

> Note / example: the code below illustrates a boundary; it is not production benchmark data.

Rust is especially useful where configuration turns into a resource.

```rust
fn bounded_timeout(seconds: f64) -> Result<std::time::Duration, &'static str> {
    if !seconds.is_finite() || seconds <= 0.0 {
        return Err("timeout must be positive and finite");
    }
    std::time::Duration::try_from_secs_f64(seconds).map_err(|_| "timeout is out of range")
}
```

The fallible conversion keeps the failure close to the transport boundary.
