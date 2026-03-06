import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { ReviewsMarquee } from "@/components/sections/reviews-marquee";
import { HowItWorks } from "@/components/sections/how-it-works";
import { TrustSignals } from "@/components/sections/trust-signals";
import { FAQ } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";
import { FeaturedProducts } from "./featured-products";
import { getOrganizationJsonLd } from "@/lib/json-ld";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationJsonLd()),
        }}
      />
      <Hero />
      <FeaturedProducts />
      <SocialProof />
      <ReviewsMarquee />
      <HowItWorks />
      <TrustSignals />
      <FAQ />
      <CTASection />
    </>
  );
}
