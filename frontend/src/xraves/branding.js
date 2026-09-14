import defaultFavicon from '../assets/favicon.png';
import xravesLogo from './assets/xraves-logo.png';

// Xraves-specific product copy and asset hooks live here so upstream merges do
// not require hunting for brand strings throughout the application.
const branding = Object.freeze({
  productName: 'Xraves Campaigns',
  organization: 'Xraves',
  applicationTitle: 'Xraves Campaigns',
  footerText: 'Campaign management by Xraves',

  logoUrl: xravesLogo,
  faviconUrl: defaultFavicon,

  // These are the current upstream colors, retained as neutral placeholders.
  // Keep them synchronized with theme.scss when final brand colors are chosen.
  colors: Object.freeze({
    primary: '#0055d4',
    secondary: '#36995b',
  }),
});

export default branding;
