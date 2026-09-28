import { Cloak } from "./Cloak";
import { Commanders, Commission, Course, Footer } from "./Closing";
import { Deck, Fleet } from "./Fleet";
import { Missions } from "./Missions";
import { Nav } from "./Nav";
import { Hero, Manifesto } from "./Opening";
import { Rules } from "./Rules";

/**
 * Midnight Armada: a concept page for a future service, a private command deck for fleets of AI
 * agents on the Midnight network. Standalone by design: its own theme, fonts and words, linked
 * from nowhere. Every section below the hero is in the nav, in page order.
 */
export function ArmadaApp() {
  return (
    <>
      <Nav />
      <Hero />
      <Manifesto />
      <Fleet />
      <Deck />
      <Missions />
      <Cloak />
      <Rules />
      <Commanders />
      <Course />
      <Commission />
      <Footer />
    </>
  );
}
