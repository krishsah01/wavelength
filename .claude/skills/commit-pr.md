---
name: review-branch
description: Helps with a specific task. Use when you need to review the changes in this branch, fill in the PR template in /.github/pull_request_template.md, and flag anything worth reviewing before merge.
---

# Review Branch

Review the changes in this branch

## When to use this skill

- Use this when you need to review the changes in this branch, fill in the PR template in /.github/pull_request_template.md, and flag anything worth reviewing before merge

## How to use it

1. Review the changes in this branch (git status, git diff, view relevant files)
2. Restore the PR template to the blank state below — overwrite the entire file with only the blank template, discarding any content from a previously merged PR
3. Fill in every section of the blank template based on the current branch changes
4. Flag anything worth reviewing before merge in the Code Review Notes section
5. Write a suitable commit message and push the changes to the branch

## How to fill up PR template

- Strictly follow .md file format
- Avoid using \n because it will break the PR template
- I will provide you with issue number when asked to use this skill and you have to fill it in the PR template like this: `Closes #<issue_number>`

## Blank template (always reset to this before filling in)

The file at `.github/pull_request_template.md` must be completely overwritten with the following blank template first, then filled in with details from the current branch. Never carry over content from a previous PR.

```
## What does this PR do?

[description]

## Related Issue

Closes #<issue_number>

## Type of change

- [ ] New feature
- [ ] Bug fix
- [ ] Refactor
- [ ] DevOps / config

## Checklist

- [ ] Code works locally
- [ ] No console errors
- [ ] Follows existing patterns in the codebase

## Code Review Notes

[notes]

## Summary

[summary]
```
