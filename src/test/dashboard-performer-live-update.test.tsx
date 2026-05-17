import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CatalogProvider } from "@/context/CatalogContext";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import { Toaster } from "@/components/ui/toaster";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: () => {},
});

function TestApp() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <CatalogProvider>
        <Toaster />
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </AppLayout>
      </CatalogProvider>
    </MemoryRouter>
  );
}

describe("dashboard performer edits", () => {
  it("updates performer counts on Home immediately after save without reload", async () => {
    render(<TestApp />);

    const alexName = screen.getByText("Alex Rivera");
    const alexCard = alexName.closest("a");
    expect(alexCard).not.toBeNull();
    expect(within(alexCard as HTMLElement).getByText("4 items")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /manage/i }));
    fireEvent.click(await screen.findByTestId("edit-video-v2"));

    const p2Toggle = await screen.findByTestId("performer-toggle-p2");
    const p1Toggle = screen.getByTestId("performer-toggle-p1");

    expect(p2Toggle).toHaveAttribute("aria-pressed", "true");
    expect(p1Toggle).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(p2Toggle);
    fireEvent.click(p1Toggle);

    expect(p2Toggle).toHaveAttribute("aria-pressed", "false");
    expect(p1Toggle).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /update/i }));

    await screen.findByText("Item updated");
    fireEvent.click(screen.getByRole("link", { name: /home/i }));

    await waitFor(() => {
      const alexUpdated = screen.getByText("Alex Rivera").closest("a");
      expect(alexUpdated).not.toBeNull();
      expect(within(alexUpdated as HTMLElement).getByText("5 items")).toBeInTheDocument();
    });
  });
});
