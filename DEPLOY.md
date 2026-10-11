# Deploy checklist — findraco rebrand

The app has been renamed to **findraco**. Deploying the rebrand requires a few manual
Portainer/VPS steps in addition to the normal `git push` → GitHub Actions redeploy flow.

## Pre-deploy

- [ ] Confirm the Portainer stack env var has been renamed to `VITE_FINDRACO_API_URL`. The
  production nginx-served build falls back to same-origin `/api/findraco`, but any explicit value
  must use the new name.
- [ ] Confirm the API is no longer expected to serve the previous `/api` prefix. Old cached
  frontend bundles that call the old prefix will be forwarded by nginx and 404 at the API — this
  is expected and acceptable only during a full stack redeploy.

## Manual VPS steps

- [ ] Rename the Portainer stack to `findraco`. The GitHub Actions workflow only triggers a
  redeploy of the existing stack ID; the stack name itself is managed in Portainer.
- [ ] Update the Portainer stack comment/URL reference (the workflow error message mentions
  `/stacks/findraco?id=<STACK_ID>`).

## Post-deploy

- [ ] Verify the browser tab shows the new favicon and the page title reads **findraco**.
- [ ] Verify the navbar, login, and register pages display the dragon-wing-and-coin logo.
- [ ] Toggle light/dark themes and confirm every page (login, dashboard, transactions,
  categories) renders legibly in both modes.
- [ ] Spot-check the 404 page (any unknown route) shows the themed centered logo + "Page not
  found" + home link.
