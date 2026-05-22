import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ProtectedRoute from "@/components/ProtectedRoute";
import { upsertVideo } from "@/lib/catalogApi";
import { videos } from "@/data/mockData";

const authState = { user: null as null | { id: string }, loading: false };

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: authState.user,
    session: null,
    loading: authState.loading,
    signInWithMagicLink: vi.fn(),
    signOut: vi.fn(),
  }),
}));

const upsertMock = vi.fn(async () => ({ error: null }));
const getUserMock = vi.fn(async () => ({ data: { user: null }, error: null }));
const deleteChain = { eq: vi.fn(async () => ({ error: null })) };
const fromMock = vi.fn((table: string) => ({
  upsert: upsertMock,
  delete: () => deleteChain,
  insert: vi.fn(async () => ({ error: null })),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: () => getUserMock() },
    from: (table: string) => fromMock(table),
  },
}));

describe("auth foundation", () => {
  it("redirects anonymous users away from dashboard route", () => {
    authState.user = null;
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/dashboard" element={<ProtectedRoute><div>Dashboard</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("blocks video upsert when no auth user is present", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: null });
    await expect(upsertVideo(videos[0])).rejects.toThrow("You must be logged in");
  });
});
