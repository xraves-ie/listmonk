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

  // Keep these synchronized with theme.scss for components that need colors
  // at runtime rather than through CSS.
  colors: Object.freeze({
    primary: '#3730a3',
    secondary: '#818cf8',
  }),
});

export default branding;
