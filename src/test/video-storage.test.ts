import { describe, expect, it, vi, beforeEach } from "vitest";
import { getVideoPublicUrl, resolveVideoSource, uploadVideoFileForVideo } from "@/lib/videoStorage";

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

describe("video storage helpers", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    uploadMock.mockReset();
    getPublicUrlMock.mockReset();
  });

  it("rejects upload for anonymous users", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null }, error: null });
    await expect(uploadVideoFileForVideo("v1", new File(["x"], "clip.mp4", { type: "video/mp4" }))).rejects.toThrow("logged in");
  });

  it("uploads to user scoped path and returns public url", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "user-123" } }, error: null });
    uploadMock.mockResolvedValueOnce({ error: null });
    getPublicUrlMock.mockReturnValueOnce({ data: { publicUrl: "https://cdn/clip.mp4" } });

    const result = await uploadVideoFileForVideo("video-1", new File(["x"], "clip.webm", { type: "video/webm" }));

    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(uploadMock.mock.calls[0][0]).toMatch(/^user-123\/video-1-/);
    expect(result.publicUrl).toBe("https://cdn/clip.mp4");
    expect(result.path).toMatch(/^user-123\/video-1-/);
  });

  it("returns public url from path", () => {
    getPublicUrlMock.mockReturnValueOnce({ data: { publicUrl: "https://cdn/public.mp4" } });
    expect(getVideoPublicUrl("u/v-1.mp4")).toBe("https://cdn/public.mp4");
  });

  it("resolves playback source preferring external url", () => {
    expect(resolveVideoSource({ videoUrl: "https://example.com/a.mp4", videoStoragePath: "u/v.mp4" })).toBe("https://example.com/a.mp4");

    getPublicUrlMock.mockReturnValueOnce({ data: { publicUrl: "https://cdn/hosted.mp4" } });
    expect(resolveVideoSource({ videoStoragePath: "u/v.mp4" })).toBe("https://cdn/hosted.mp4");

    expect(resolveVideoSource({})).toBeUndefined();
  });
});
