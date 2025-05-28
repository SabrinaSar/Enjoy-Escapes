// Static image imports for better caching (1 year Cache-Control)
// Using static imports helps reduce image optimization costs by setting automatic cache headers

import logoImage from "/public/logo.png";
import websiteFeaturesImage from "/public/website-features.png";
import heroImage from "/public/hero.jpg";
import socialImage from "/public/social.png";

// Brand logos - static imports for better caching
import tuiLogo from "/public/images/tui.png";
import loveholidaysLogo from "/public/images/loveholidays.png";
import onthebeachLogo from "/public/images/onthebeach.png";
import barbadosLogo from "/public/images/barbados.png";
import visitPortugalLogo from "/public/images/visit-portugal.png";
import birminghamAirportLogo from "/public/images/birmingham-airport.png";
import kayakLogo from "/public/images/kayak.png";
import bandosMaldivesLogo from "/public/images/bandos-maldives.png";
import tripcomLogo from "/public/images/trip.com.png";
import samsungLogo from "/public/images/samsung.png";
import norseLogo from "/public/images/norse.png";
import govukLogo from "/public/images/gov.uk.png";

export const staticAssets = {
  // Main site assets
  logo: logoImage,
  websiteFeatures: websiteFeaturesImage,
  hero: heroImage,
  social: socialImage,
  
  // Brand logos
  brands: {
    tui: tuiLogo,
    loveholidays: loveholidaysLogo,
    onthebeach: onthebeachLogo,
    barbados: barbadosLogo,
    visitPortugal: visitPortugalLogo,
    birminghamAirport: birminghamAirportLogo,
    kayak: kayakLogo,
    bandosMaldives: bandosMaldivesLogo,
    tripcom: tripcomLogo,
    samsung: samsungLogo,
    norse: norseLogo,
    govuk: govukLogo,
  },
};

export default staticAssets; 