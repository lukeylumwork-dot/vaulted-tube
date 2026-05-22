import { describe, expect, it, vi, beforeEach } from "vitest";
import { getThumbnailPublicUrl, uploadThumbnailForVideo } from "@/lib/thumbnailStorage";

const getUserMock = vi.fn();
const uploadMock = vi.fn();
const getPublicUrlMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: () => getUserMock() },
    storage: {
      from: () => ({
        upload: uploadMock,
        getPublicUrl: getPublicUrlMock,
      }),
    },
  },
}));

describe("thumbnail storage helpers", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    uploadMock.mockReset();
    getPublicUrlMock.mockReset();
  });

  it("rejects upload for anonymous users", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: null });
    await expect(uploadThumbnailForVideo("v1", new File(["x"], "thumb.jpg", { type: "image/jpeg" }))).rejects.toThrow("logged in");
  });

  it("uploads to user scoped path and returns public url", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "user-123" } }, error: null });
    uploadMock.mockResolvedValueOnce({ error: null });
    getPublicUrlMock.mockReturnValueOnce({ data: { publicUrl: "https://cdn/thumb.jpg" } });

    const result = await uploadThumbnailForVideo("video-1", new File(["x"], "image.png", { type: "image/png" }));

    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(uploadMock.mock.calls[0][0]).toMatch(/^user-123\/video-1-/);
    expect(result.publicUrl).toBe("https://cdn/thumb.jpg");
    expect(result.path).toMatch(/^user-123\/video-1-/);
  });

  it("returns public url from path", () => {
    getPublicUrlMock.mockReturnValueOnce({ data: { publicUrl: "https://cdn/public.jpg" } });
    expect(getThumbnailPublicUrl("u/v-1.jpg")).toBe("https://cdn/public.jpg");
  });
});
