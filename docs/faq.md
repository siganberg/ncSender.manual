# Frequently Asked Questions

Answers to the questions that come up most often in support.

## Commands keep failing even when they're valid

**Symptom.** After a G-code error, the controller starts rejecting subsequent commands — either with the same error, or a generic "Unknown error" — even though those commands are correctly formatted and worked moments earlier.

**Common example.** You send a series of `M64` / `M65` (auxiliary output) commands. One fails. The next ones also fail, even though they're identical in shape to ones that just succeeded.

**Cause.** This is grblHAL behavior, not an ncSender bug. When grblHAL hits certain errors during a command stream, it can leave its parser and motion planner momentarily out of sync while it makes sure the machine is in a well-defined state. Until that state clears, subsequent commands that would normally succeed keep getting rejected — even benign ones like auxiliary output toggles. It's a safety-first choice by grblHAL: rather than accept commands into an ambiguous state, the controller stops accepting them at all.

**Fix.** Send a **single jog command** to nudge the controller back into a normal ready state:

```
$J=G21 G91 X1 F3000
```

That's a 1 mm relative jog on X at 3000 mm/min — small, fast, and predictable. Once it completes, subsequent commands are accepted normally.

If a 1 mm move isn't safe on your setup (near a fixture, small workspace), use a smaller step:

```
$J=G21 G91 X0.1 F1000
```

The specific movement doesn't matter — the point is to get one jog through the controller so it reinitialises its state.

**If the jog also fails,** the controller is likely in an **alarm** state (a stronger stop than an error state). Check the machine status in ncSender's status panel; you may need to send `$X` to unlock, then investigate what triggered the alarm.
