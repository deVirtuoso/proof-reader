#!/bin/bash
set -euo pipefail

# DEPLOYPATH is set automatically by cPanel when you configure
# "Deploy HEAD" for this repository (point it at the subdomain docroot).

if [ -z "${DEPLOYPATH:-}" ]; then
  echo "ERROR: DEPLOYPATH is not set."
  echo "In cPanel → Git Version Control → Manage → Deploy HEAD Commit,"
  echo "set the deployment directory to proproof.worldwidechoices.com document root."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  if [ -f "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    source "$HOME/.nvm/nvm.sh"
  fi
fi

if command -v npm >/dev/null 2>&1; then
  echo "Building with npm..."
  npm ci
  npm run build
else
  echo "WARN: npm not found on server."
  if [ ! -f dist/index.html ]; then
    echo "ERROR: dist/ is missing. Either enable Node.js in cPanel or run"
    echo "  npm run build"
    echo "locally and upload dist/ via File Manager."
    exit 1
  fi
  echo "Using existing dist/ folder."
fi

if [ ! -f dist/index.html ]; then
  echo "ERROR: dist/index.html not found after build."
  exit 1
fi

/bin/mkdir -p "$DEPLOYPATH"
/bin/cp -R dist/. "$DEPLOYPATH/"
echo "Deployed static site to $DEPLOYPATH"
