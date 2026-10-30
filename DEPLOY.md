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

- [ ] Before deploying the time slice (V14, instants to `timestamptz`): confirm the API container
  runs in UTC with `docker exec findraco-api date`. The migration reads the old `timestamp` values
  as UTC; a container in another zone would shift every stored session, reset token and invitation
  expiry by that offset. If the zone is not UTC, stop and change the migration's `AT TIME ZONE`.
- [ ] Rename the Portainer stack to `findraco`. The GitHub Actions workflow only triggers a
  redeploy of the existing stack ID; the stack name itself is managed in Portainer.
- [ ] Update the Portainer stack comment/URL reference (the workflow error message mentions
  `/stacks/findraco?id=<STACK_ID>`).

- [ ] Before deploying the network slice (API reachable only through the proxy): set `SERVER_ADDRESS`
  in the Portainer stack env to the **docker0 gateway**, usually `172.17.0.1` (check with
  `ip -4 addr show docker0`). The compose file refuses to start without it, on purpose: an unset value
  must never bind the API on the public IP. The nginx container reaches the API through
  `host.docker.internal`, which is that same address.
- [ ] After that deploy, from outside the VPS: `curl http://<public-ip>:3000/api/findraco/v3/api-docs`
  must be refused (connection refused or timeout), and the site (`http://<public-ip>:<WEB_PORT>`) must
  still log in and load data. Swagger is no longer on the public IP; for a look at it, use an SSH tunnel
  (`ssh -L 3000:172.17.0.1:3000 <vps>`).
- [ ] Before deploying the authentication slice (decoded JWT key): the API now Base64-**decodes**
  `JWT_SECRET_KEY` and refuses to start when the result is under 32 bytes. Check the production value:
  `printf '%s' "$JWT_SECRET_KEY" | base64 -d | wc -c` must print 32 or more and not fail. If not,
  generate one with `openssl rand -base64 48` and set it in the Portainer stack env. Either way the
  access tokens issued before the deploy stop working once (they last 15 minutes) and the browser
  renews them from its session cookie without asking the user to sign in again.

## Post-deploy

- [ ] Verify the browser tab shows the new favicon and the page title reads **findraco**.
- [ ] Verify the navbar, login, and register pages display the dragon-wing-and-coin logo.
- [ ] Toggle light/dark themes and confirm every page (login, dashboard, transactions,
  categories) renders legibly in both modes.
- [ ] Spot-check the 404 page (any unknown route) shows the themed centered logo + "Page not
  found" + home link.
