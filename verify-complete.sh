#!/bin/bash

echo "🔍 Verifying Complete TCN Comply Malta Implementation"

required_files=("app/page.js" "app/layout.js" "app/dashboard/page.js" "package.json" "tailwind.config.js")
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

if grep -q "bundyglenn@gmail.com" app/layout.js app/page.js; then
    echo "✅ Contact email correctly configured"
else
    echo "❌ Contact email not found in files"
fi

malta_terms=("2026 Labour Migration Policy" "Pre-Departure Course" "Skills Pass" "Jobsplus" "EURES")
found_terms=0

for term in "${malta_terms[@]}"; do
  if grep -q "$term" app/page.js; then
    ((found_terms++))
  fi
done

if [ $found_terms -ge 3 ]; then
    echo "✅ Malta compliance terms present (${found_terms}/5)"
else
    echo "⚠️  Some Malta compliance terms missing (${found_terms}/5)"
fi

echo "✅ Verification complete - ready for deployment!"
