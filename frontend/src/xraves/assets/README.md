# Xraves brand assets

`xraves-logo.png` is the official 256 x 95 transparent Xraves wordmark supplied
from `xraves.ie`. The final favicon has not been supplied, so the admin UI still
reuses the upstream favicon as a clearly documented placeholder.

To replace or update assets:

1. Add optimized SVG/PNG files to this directory. Preserve transparency and do
   not upscale raster originals.
2. Import them from `../branding.js` and assign them to `logoUrl` or
   `faviconUrl`.
3. Keep useful alternative text based on `branding.productName`.
4. Run `yarn lint` and `yarn build` from `frontend/`, then run `make dist` from
   the repository root.
