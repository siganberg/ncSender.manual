# Manual Tool Changer

Manual tool change workflow with Tool Length Setter (TLS) support.

## Features

- Pause program on M6 tool change commands
- Display tool change instructions
- Optional TLS (Tool Length Setter) probing after each change
- Configurable number of tool slots

## Workflow

1. Program encounters M6 (tool change)
2. Machine pauses and retracts to safe Z
3. User is prompted to change the tool
4. After confirming, the machine probes the TLS (if enabled)
5. New tool length offset is applied
6. Program resumes
