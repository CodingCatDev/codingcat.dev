#!/bin/bash

result=$(git diff HEAD^ HEAD --quiet .)

if [[ $result == true ]]; then
  echo "🛑 - Build other folder"
  exit 0;
else
  echo "✅ - Build this folder"
fi

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main"  ]] ; then
  # Proceed with the build
    echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi
