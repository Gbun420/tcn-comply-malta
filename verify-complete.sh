#!/bin/bash

echo "🔍 Verifying TCN Comply Malta repository hygiene"

required_files=(
  "app/page.js"
  "app/layout.js"
  "app/dashboard/page.js"
  "app/terms/page.js"
  "package.json"
  "tailwind.config.js"
)
missing_files=()

for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    missing_files+=("$file")
  fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
  echo "✅ All required files present"
else
  echo "❌ Missing files: ${missing_files[*]}"
  exit 1
fi

if grep -q "bundyglenn@gmail.com" app/layout.js app/page.js app/auth/login/page.js README.md; then
  echo "❌ Personal email still present"
  exit 1
else
  echo "✅ Personal email removed from public-facing files"
fi

if grep -q "contact@tcncomply.mt" app/layout.js app/page.js README.md; then
  echo "✅ Placeholder contact email configured"
else
  echo "❌ Placeholder contact email missing"
  exit 1
fi

echo "✅ Verification complete"
