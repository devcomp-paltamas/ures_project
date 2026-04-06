import { LandingAuthSection } from "@/components/landing/landing-auth-section";
import { LandingBlocks } from "@/components/landing/landing-blocks";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPageStory } from "@/components/landing/landing-page-story";
import { PublicFeed } from "@/components/landing/public-feed";
import { useBootstrapQuery } from "@/hooks/use-bootstrap-query";

export function LandingPage() {
  const { data, isLoading } = useBootstrapQuery();

  return (
    <main>
      <LandingHero />
      <LandingPageStory />
      <LandingBlocks blocks={data?.landingBlocks ?? []} isLoading={isLoading} />
      <LandingAuthSection />
      <PublicFeed isLoading={isLoading} items={data?.publicItems ?? []} />
    </main>
  );
}
