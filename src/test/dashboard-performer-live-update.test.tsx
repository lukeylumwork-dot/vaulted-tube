import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CatalogProvider } from "@/context/CatalogContext";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import { Toaster } from "@/components/ui/toaster";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { videos, performers, tags, collections } from "@/data/mockData";

const fetchCatalogDataMock = vi.fn(async () => ({ videos, performers, tags, collections, userPreferences: null }));
const upsertVideoMock = vi.fn<(video: unknown) => Promise<void>>(async () => undefined);

vi.mock("@/lib/catalogApi", () => ({
  formatDuration: (seconds: number) => `${Math.floor(seconds / 60)}m`,
  fetchCatalogData: () => fetchCatalogDataMock(),
  upsertVideo: (video: unknown) => upsertVideoMock(video),
}));

class MockIntersectionObserver { observe() {} disconnect() {} unobserve() {} }
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: MockIntersectionObserver });
Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", { writable: true, value: () => {} });

function TestApp() {
  return <MemoryRouter initialEntries={["/"]}><CatalogProvider><Toaster /><AppLayout><Routes><Route path="/" element={<HomePage />} /><Route path="/dashboard" element={<DashboardPage />} /></Routes></AppLayout></CatalogProvider></MemoryRouter>;
}

beforeEach(() => {
  fetchCatalogDataMock.mockClear();
  upsertVideoMock.mockReset();
  upsertVideoMock.mockResolvedValue(undefined);
});

describe("dashboard performer edits", () => {
  it("updates performer counts on Home immediately after save without reload", async () => {
    render(<TestApp />);
    await screen.findByText("Alex Rivera");
    const alexCard = screen.getByText("Alex Rivera").closest("a");
    expect(within(alexCard as HTMLElement).getByText("4 items")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /manage/i }));
    fireEvent.click(await screen.findByTestId("edit-video-v2"));
    const p2Toggle = await screen.findByTestId("performer-toggle-p2");
    const p1Toggle = screen.getByTestId("performer-toggle-p1");
    fireEvent.click(p2Toggle);
    fireEvent.click(p1Toggle);
    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await waitFor(() => expect(screen.getByText("Manage Catalog")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("link", { name: /home/i }));
    await waitFor(() => expect(within(screen.getByText("Alex Rivera").closest("a") as HTMLElement).getByText("4 items")).toBeInTheDocument());
  });

  it("keeps edit form open and shows error when save fails", async () => {
    upsertVideoMock.mockRejectedValueOnce(new Error("Permission denied"));

    render(<TestApp />);
    fireEvent.click(await screen.findByRole("link", { name: /manage/i }));
    fireEvent.click(await screen.findByTestId("edit-video-v2"));

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    expect(await screen.findByText("Edit Item")).toBeInTheDocument();
    expect(await screen.findByText("Save failed")).toBeInTheDocument();
    expect(await screen.findByText("Permission denied")).toBeInTheDocument();
  });
});
