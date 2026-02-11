# Configfile Components References

This file maps components in this folder to short descriptions and links to the project specification.

Project specification: https://agentskills.io/specification

- `ContainerForm.tsx`: Parent form for editing a single `ContainerConfig` inside a workload. Uses the smaller subcomponents listed below.
- `ContainerHeader.tsx`: Header controls for a single container (name, duplicate, collapse, remove).
- `ContainerResources.tsx`: Resource requests/limits UI (CPU/Memory/GPU) for the container.
- `ContainerCommandArgs.tsx`: Command and args input fields for the container.
- `ContainerEnv.tsx`: Wrapper that renders `EnvVarManager` for container environment variables.
- `ContainerPorts.tsx`: Wrapper that renders `PortManager` for container ports.
- `ContainerMounts.tsx`: Lightweight per-container mounts editor (add/remove mounts and subpaths). Non-invasive — does not touch global `MountManager` logic.
- `EnvVarManager.tsx`: Implementation of environment variable list management.
- `PortManager.tsx`: Implementation of container port list management.
- `MountManager.tsx`: Project-level mount manager used elsewhere (wizard/global) — see `MountRow.tsx` for per-mount UI.
- `MountRow.tsx`: Row editor used by `MountManager` for full-featured mount editing (project-level).

How to use:

- Each item above references the file in this directory. Use the `Container*` wrappers for per-container editing inside the `ContainerForm` flow.

Notes:

- The `agentskills` specification is used as a general design reference for agent-driven UI/UX. Link above for quick reference.
