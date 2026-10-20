import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext, type AuthContextValue, useAuth } from "./useAuth";

afterEach(cleanup);

describe("useAuth", () => {
  it("returns the provided value inside an AuthProvider (STD-02 AC 6)", () => {
    const value: AuthContextValue = {
      user: { id: 1, name: "Ana Lima", email: "ana@example.com" },
      setUser: vi.fn(),
      status: "authenticated",
      signIn: vi.fn(),
      signOut: vi.fn(),
      retry: vi.fn(),
      announceSessionExpiry: vi.fn(),
    };
    function wrapper({ children }: { children: ReactNode }) {
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    }

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(value);
  });
});
