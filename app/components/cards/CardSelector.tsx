import { EscapeData } from "@/app/actions/fetchEscapes";
import FeaturedCard from "./FeaturedCard";
import HotDealCard from "./HotDealCard";
import React from "react";
import StandardCard from "./StandardCard";

interface CardSelectorProps {
  escape: EscapeData;
}

/**
 * CardSelector component that decides which card type to render based on the escape properties
 *
 * Priority order:
 * 1. Hot Deal
 * 2. Featured
 * 3. Standard
 */
const CardSelector: React.FC<CardSelectorProps> = ({ escape }) => {
  // If the escape is a hot deal, use the HotDealCard
  if (escape.hot_deal) {
    return <HotDealCard escape={escape} />;
  }

  // If the escape is featured, use the FeaturedCard
  if (escape.featured) {
    return <FeaturedCard escape={escape} />;
  }

  // Otherwise, use the StandardCard
  return <StandardCard escape={escape} />;
};

export default CardSelector;
