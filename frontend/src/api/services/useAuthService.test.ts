import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { findracoApi } from "../clients/findracoApi";
import { logout } from "./useAuthService";

vi.mock("../clients/findracoApi", () => ({
  findracoApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = findracoApi as unknown as {
  get: Mock;
  post: Mock;
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("logout", () => {
  it("POSTs to /auth/logout with no body and resolves on 204", async () => {
    mockedApi.post.mockResolvedValue({ status: 204, data: "" });

    await expect(logout()).resolves.toBeUndefined();

    expect(mockedApi.post).toHaveBeenCalledTimes(1);
    expect(mockedApi.post).toHaveBeenCalledWith("/auth/logout");
  });
});
