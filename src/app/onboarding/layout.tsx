/**
 * Onboarding layout — full screen, no sidebar or topbar.
 * Next.js will use this layout instead of the root layout for /onboarding/*.
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
