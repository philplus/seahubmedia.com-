PROPOSED WORKFLOW CHANGES

Goal: prevent automatic pushes to main. Instead, have workflows push to a branch and open a PR for human review.

Suggested change (example for daily-changelog.yml):
- Replace any `git push origin main` with:
  - create a branch: `git checkout -b workflow/daily-changelog/$GITHUB_RUN_ID`
  - push branch: `git push origin HEAD:workflow/daily-changelog/$GITHUB_RUN_ID`
  - open PR via gh: `gh pr create --title "daily-changelog: $GITHUB_RUN_ID" --body "Automated changelog; please review" --base main --head workflow/daily-changelog/$GITHUB_RUN_ID`

Repeat same pattern for daily-memory-read.yml.

Please review before merging.
