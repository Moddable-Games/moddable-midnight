import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { App } from "../App";
import type { TournamentSnapshot } from "@/lib/tournament";

const snapshot: TournamentSnapshot = {
  address: "2a7fe78cdafc8126041298f307f699b319ed43e908e85287f8b72ad291e1c191",
  tournamentId: "bf".repeat(32),
  organiser: "0c".repeat(32),
  prizePool: 400n,
  prizePerClaim: 100n,
  passCount: 2n,
  claimCount: 1n,
  merkleRoot: "36775908253063397957654760888682033780440796058515540635724170409338408184141",
  spentNullifiers: ["fb".repeat(32)],
  stateBytes: 8435,
  activity: [
    {
      kind: "claimPrize",
      hash: "c2d1cfd9553df5294c431c563706154a0e2d52a16b1b3e5ec64f54e0c6e7aeed",
      blockHeight: 907570,
      timestamp: new Date(1789663302000),
    },
  ],
  fetchedAt: new Date(),
};

vi.mock("@/lib/tournament", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/tournament")>();
  return { ...actual, fetchTournament: vi.fn(async () => snapshot) };
});

describe("App", () => {
  it("renders the decoded contract state from the indexer", async () => {
    render(<App />);
    expect(await screen.findByText("400")).toBeInTheDocument();
    expect(screen.getByText("80% of 500 funded remains")).toBeInTheDocument();
    expect(screen.getByText("Enough for 4 more claims")).toBeInTheDocument();
  });

  it("lists contract activity with explorer links", async () => {
    render(<App />);
    const link = await screen.findByRole("link", { name: /c2d1cfd9/ });
    expect(link).toHaveAttribute(
      "href",
      `https://preview.midnightexplorer.com/transactions/0x${snapshot.activity[0]!.hash}`,
    );
    expect(screen.getByText("Prize claimed privately")).toBeInTheDocument();
  });
});
