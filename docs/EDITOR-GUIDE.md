# KOM USA Content Editor Guide

KOM USA uses Sanity to manage services, blog articles, location pages, projects, FAQs, and testimonials. The public website is static, so publishing content in Sanity is followed by a Netlify site rebuild.

## Sign in

1. Open [kom-usa.sanity.studio](https://kom-usa.sanity.studio).
2. Sign in with the account invited to the KOM USA project.
3. Choose the content type you want to edit from the left sidebar.

If you cannot sign in or do not see the KOM USA project, ask the project owner to add your account in Sanity project settings.

## Edit and publish content

1. Open an existing document or click the create button.
2. Complete the required fields. Keep titles clear and add useful image alt text wherever the field is available.
3. Use **Preview changes** in the editor when available.
4. Click **Publish** when the content is ready.
5. Wait for the Netlify production build to finish, then check the public page.

Saving creates a draft. The public website only reads published documents during a build.

## Content sections

- **Services:** service titles, page introductions, included work, pricing rows, and service FAQs.
- **Blog articles:** title, category, excerpt, cover image, publication date, article body, and SEO fields.
- **Locations:** city, introduction, page body, and SEO fields.
- **Projects:** title, date, project photos, problem, work completed, result, and SEO fields.
- **FAQ (homepage):** question, answer, and display order.
- **Testimonials:** customer name, quote, and the required link to the original real review.

## What stays in code

Contact details, operating hours, forms, service disclaimers, pricing guardrails, and site-wide design are intentionally managed in the codebase. Request those changes through the project owner rather than adding them to unrelated Sanity fields.

## Publishing checklist

- Check spelling, dates, prices, and links.
- Use genuine KOM USA photos and real customer reviews only.
- Do not upload confidential customer information.
- Add descriptive alt text for meaningful images.
- Confirm the page on the public site after the rebuild completes.
