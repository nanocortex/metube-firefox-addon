#!/bin/sh

# Check if version parameter is provided
if [ -z "$1" ]; then
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 1.6.1"
  exit 1
fi

NEW_VERSION=$1

# Validate version format (basic check)
if ! echo "$NEW_VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "Error: Invalid version format. Use semantic versioning (e.g., 1.6.1)"
  exit 1
fi

# Get current version from manifest.json
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' ./src/manifest.json | cut -d'"' -f4)

if [ -z "$CURRENT_VERSION" ]; then
  echo "Error: Could not extract current version from manifest.json"
  exit 1
fi

echo "Current version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"
echo ""

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: You have uncommitted changes. Please commit or stash them first."
  git status --short
  exit 1
fi

# Check if tag already exists
if git rev-parse "v$NEW_VERSION" >/dev/null 2>&1; then
  echo "Error: Tag v$NEW_VERSION already exists"
  exit 1
fi

# Confirm with user
echo "This will:"
echo "  1. Update version in src/manifest.json to $NEW_VERSION"
echo "  2. Open CHANGELOG.md for you to add release notes"
echo "  3. Commit the changes"
echo "  4. Create and push tag v$NEW_VERSION"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled"
  exit 0
fi

# Update version in manifest.json
echo "Updating manifest.json..."
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" ./src/manifest.json

# Verify the change
NEW_MANIFEST_VERSION=$(grep -o '"version": "[^"]*"' ./src/manifest.json | cut -d'"' -f4)
if [ "$NEW_MANIFEST_VERSION" != "$NEW_VERSION" ]; then
  echo "Error: Failed to update version in manifest.json"
  exit 1
fi

echo "Version updated successfully in manifest.json"

# Prepare CHANGELOG.md entry
CHANGELOG_DATE=$(date +"%Y-%m-%d")
CHANGELOG_ENTRY="## $NEW_VERSION - $CHANGELOG_DATE\n- \n"

# Check if CHANGELOG.md exists
if [ -f "CHANGELOG.md" ]; then
  # Add new entry after the first line (# Changelog)
  sed -i '' "2i\\
\\
$CHANGELOG_ENTRY
" CHANGELOG.md

  echo ""
  echo "CHANGELOG.md has been updated with a template entry."
  echo "Opening CHANGELOG.md for you to add release notes..."
  echo ""

  # Open CHANGELOG.md in default editor
  ${EDITOR:-vi} CHANGELOG.md

  echo ""
  read -p "Have you finished editing CHANGELOG.md? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled. Please edit CHANGELOG.md and commit manually."
    exit 1
  fi
else
  echo "Warning: CHANGELOG.md not found, skipping..."
fi

# Commit the version change
echo "Committing version change..."
git add ./src/manifest.json CHANGELOG.md
git commit -m "Bump version to $NEW_VERSION"

# Create and push tag
echo "Creating tag v$NEW_VERSION..."
git tag "v$NEW_VERSION"

echo "Pushing changes and tag to origin..."
git push origin master
git push origin "v$NEW_VERSION"

echo ""
echo "Done! Version $NEW_VERSION has been released."
echo "Check: https://github.com/nanocortex/metube-firefox-addon/actions"
