# Community Knowledge Base

This folder contains markdown files that make up our community-driven financial education resources.

## How to Contribute

1. **Fork the Repository**: Start by forking our repository to your GitHub account
2. **Create a New File**: Add your markdown file to this directory
3. **Follow the Template**: Use `template.md` as a starting point
4. **Update Metadata**: Add your file information to `metadata.json`
5. **Submit a PR**: Create a pull request with your contribution

## File Structure

```
markdown/
├── README.md           # This file
├── metadata.json       # File metadata and information
├── tutorial.md         # Getting started guide
├── template.md         # Template for new contributions
├── investment-basics.md # Community contributions
└── ...                 # Your contributions here
```

## File Naming Convention

- Use kebab-case for filenames (e.g., `investment-basics.md`)
- Keep names descriptive and concise
- Avoid special characters except hyphens

## Metadata Format

Each file should be listed in `metadata.json` with the following structure:

```json
{
  "id": "your-file-id",
  "title": "Your Article Title",
  "preview": "Brief description of the article...",
  "path": "/markdown/your-file.md",
  "author": "Your Name",
  "lastUpdated": "YYYY-MM-DD",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## Content Guidelines

- Use clear, descriptive titles
- Include a brief preview in the first paragraph
- Add relevant tags for categorization
- Keep content focused and educational
- Ensure accuracy of financial information
- Cite sources when appropriate
- Use clear, accessible language
- Include practical examples

## Quality Standards

- Ensure accuracy of financial information
- Cite sources when appropriate
- Use clear, accessible language
- Include practical examples
- Follow the established markdown format

## Getting Help

If you have questions about contributing, please:
- Check the tutorial.md file
- Review existing contributions
- Ask in our community discussions

Happy contributing! 🚀
