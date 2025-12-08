# Branch Protection Setup Guide

This document explains how to set up and configure branch protection for the main branch to prevent direct pushes.

## Understanding Branch Protection

GitHub provides two complementary approaches to protect branches:

1. **Branch Protection Rules** (Primary method - configured in repository settings)
2. **Status Checks via GitHub Actions** (Secondary method - this repository's approach)

## Important Limitation

⚠️ **GitHub Actions workflows cannot prevent pushes** - they run AFTER code is already pushed to the branch. The workflow in `.github/workflows/protect-main-branch.yml` will fail if someone pushes directly to main, but the commits will already be in the branch history.

For true push prevention, you must configure branch protection rules in the repository settings.

## Setting Up Branch Protection Rules

### Prerequisites
- You must be a repository administrator or owner

### Steps

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Click on "Branches" in the left sidebar

2. **Add Branch Protection Rule**
   - Click "Add branch protection rule"
   - Enter `main` as the branch name pattern

3. **Configure Protection Settings**
   
   **Required Settings:**
   - ☑ **Require a pull request before merging**
     - ☑ Require approvals (recommended: at least 1)
     - ☑ Dismiss stale pull request approvals when new commits are pushed
   
   - ☑ **Require status checks to pass before merging**
     - Search for and select: `prevent-push` (from the workflow)
     - ☑ Require branches to be up to date before merging
   
   - ☑ **Require conversation resolution before merging** (recommended)
   
   - ☑ **Do not allow bypassing the above settings**
     - This ensures even administrators must follow the rules

   **Optional but Recommended:**
   - ☑ Require signed commits
   - ☑ Require linear history
   - ☑ Include administrators (prevents even admins from pushing directly)

4. **Save Changes**
   - Click "Create" or "Save changes"

## How It Works Together

1. **Branch Protection Rules** prevent direct pushes at the repository level
2. **Status Check Workflow** provides an additional safety net and clear messaging
3. Users must create pull requests to merge changes into main
4. The workflow status must pass (which it will for PRs, but not for direct pushes)

## Testing the Protection

### Test that direct push is blocked:
```bash
# This should be blocked by branch protection rules
git checkout main
echo "test" > test.txt
git add test.txt
git commit -m "Test direct push"
git push origin main
# Expected: Error message about branch protection
```

### Correct workflow using pull request:
```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes
echo "feature" > feature.txt
git add feature.txt
git commit -m "Add feature"

# Push feature branch
git push origin feature/my-feature

# Create pull request via GitHub UI
# Merge after approval and status checks pass
```

## Troubleshooting

### "Push declined due to email privacy restrictions"
- Configure your Git email or adjust repository settings

### "Required status checks are failing"
- This is expected if trying to push to main directly
- Create a pull request instead

### "You're not authorized to push to this branch"
- Branch protection is working correctly
- Use pull requests to contribute

## Benefits

- ✅ Enforces code review process
- ✅ Maintains clean commit history
- ✅ Prevents accidental direct pushes
- ✅ Ensures CI/CD checks run before merging
- ✅ Creates audit trail for all changes

## Additional Resources

- [GitHub Branch Protection Rules Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
