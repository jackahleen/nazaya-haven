#!/usr/bin/env bash
set -euo pipefail

mkdir -p artifacts/demo

target_url="${DEMO_TARGET_URL:-}"
if [[ -z "$target_url" ]]; then
  github_repository="${GITHUB_REPOSITORY:-}"
  repo_name="${github_repository##*/}"
  owner="${GITHUB_REPOSITORY_OWNER:-}"
  if [[ -n "$owner" && "$repo_name" == "$owner.github.io" ]]; then
    target_url="https://${owner}.github.io/"
  elif [[ -n "$owner" && -n "$repo_name" ]]; then
    target_url="https://${owner}.github.io/${repo_name}/"
  else
    target_url="http://127.0.0.1:3000/"
  fi
fi

default_task="Open ${target_url}, navigate through the Nazaya Haven landing page, login page, and dashboard, and capture a concise demo-video walkthrough for Hack Berkeley Ddoski World. Use demo credentials only."
task="${AGENT_S_TASK:-$default_task}"

cat > artifacts/demo/demo-brief.md <<EOF
# Nazaya Haven Demo Run

Target URL: ${target_url}

Task:
${task}

Modes:
- SIMULAR_DEMO_COMMAND: run a sponsor-provided Simular Cloud or desktop command.
- AGENT_S_ENABLE_RUN=true: install gui-agents and run the Agent-S CLI with grounding configuration.
- Default: write this brief and skip execution.
EOF

if [[ -n "${SIMULAR_DEMO_COMMAND:-}" ]]; then
  echo "Running sponsor-provided SIMULAR_DEMO_COMMAND."
  bash -lc "$SIMULAR_DEMO_COMMAND"
  exit 0
fi

if [[ "${AGENT_S_ENABLE_RUN:-false}" != "true" ]]; then
  cat > artifacts/demo/agent-s-command-template.txt <<EOF
AGENT_S_ENABLE_RUN=true \\
OPENAI_API_KEY=<set-in-secrets> \\
AGENT_S_PROVIDER=openai \\
AGENT_S_MODEL=gpt-5-2025-08-07 \\
AGENT_S_GROUND_PROVIDER=huggingface \\
AGENT_S_GROUND_URL=<grounding-endpoint-url> \\
AGENT_S_GROUND_MODEL=ui-tars-1.5-7b \\
AGENT_S_GROUNDING_WIDTH=1920 \\
AGENT_S_GROUNDING_HEIGHT=1080 \\
DEMO_TARGET_URL=${target_url} \\
tools/demo/run-agent-s-demo.sh
EOF
  echo "Agent-S execution skipped. Set SIMULAR_DEMO_COMMAND or AGENT_S_ENABLE_RUN=true to run."
  exit 0
fi

required_vars=(
  "AGENT_S_GROUND_PROVIDER"
  "AGENT_S_GROUND_URL"
  "AGENT_S_GROUND_MODEL"
  "AGENT_S_GROUNDING_WIDTH"
  "AGENT_S_GROUNDING_HEIGHT"
)

missing=()
for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    missing+=("$var_name")
  fi
done

if (( ${#missing[@]} > 0 )); then
  printf 'Missing required Agent-S configuration: %s\n' "${missing[*]}" >&2
  exit 2
fi

python -m pip install --upgrade pip
python -m pip install gui-agents

printf '%s\n' "$task" > artifacts/demo/agent-s-task.txt

timeout_seconds="${AGENT_S_TIMEOUT_SECONDS:-900}"
provider="${AGENT_S_PROVIDER:-openai}"
model="${AGENT_S_MODEL:-gpt-5-2025-08-07}"

set +e
local_env_args=()
if [[ "${AGENT_S_ENABLE_LOCAL_ENV:-false}" == "true" ]]; then
  local_env_args+=(--enable_local_env)
fi

printf '%s\n' "$task" | timeout "$timeout_seconds" agent_s \
  --provider "$provider" \
  --model "$model" \
  --ground_provider "$AGENT_S_GROUND_PROVIDER" \
  --ground_url "$AGENT_S_GROUND_URL" \
  --ground_model "$AGENT_S_GROUND_MODEL" \
  --grounding_width "$AGENT_S_GROUNDING_WIDTH" \
  --grounding_height "$AGENT_S_GROUNDING_HEIGHT" \
  "${local_env_args[@]}" \
  2>&1 | tee artifacts/demo/agent-s-run.log
agent_status="${PIPESTATUS[1]}"
set -e

if [[ -n "${SIMULAR_DEMO_VIDEO_PATH:-}" && -f "$SIMULAR_DEMO_VIDEO_PATH" ]]; then
  cp "$SIMULAR_DEMO_VIDEO_PATH" artifacts/demo/
fi

exit "$agent_status"
