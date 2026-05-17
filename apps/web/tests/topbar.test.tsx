import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopBar, initials } from "@/components/topbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { CurrentUser } from "@/lib/auth";

const user: CurrentUser = {
  id: "u1",
  name: "Asha Kumar",
  email: "asha@example.com",
  role: "Buyer",
};

function renderWithTheme(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("initials", () => {
  it("returns the first two initials uppercased", () => {
    expect(initials("Asha Kumar")).toBe("AK");
    expect(initials("ravi singh chauhan")).toBe("RS");
    expect(initials("Madonna")).toBe("M");
  });
});

describe("<TopBar />", () => {
  it("renders the brand and the user chip", () => {
    renderWithTheme(<TopBar user={user} notificationCount={0} />);
    expect(screen.getByLabelText("Krayavikrayam home")).toBeInTheDocument();
    expect(screen.getByText("Asha Kumar")).toBeInTheDocument();
    expect(screen.getByText("Buyer")).toBeInTheDocument();
  });

  it("labels the notifications button with unread count", () => {
    renderWithTheme(<TopBar user={user} notificationCount={5} />);
    expect(
      screen.getByRole("button", { name: "Notifications (5 unread)" })
    ).toBeInTheDocument();
  });

  it("omits the unread count when zero", () => {
    renderWithTheme(<TopBar user={user} notificationCount={0} />);
    expect(
      screen.getByRole("button", { name: "Notifications" })
    ).toBeInTheDocument();
  });

  it("caps the badge at 9+", () => {
    renderWithTheme(<TopBar user={user} notificationCount={42} />);
    expect(
      screen.getByRole("button", { name: "Notifications (42 unread)" })
    ).toHaveTextContent("9+");
  });

  it("exposes a help button", () => {
    renderWithTheme(<TopBar user={user} />);
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument();
  });
});
