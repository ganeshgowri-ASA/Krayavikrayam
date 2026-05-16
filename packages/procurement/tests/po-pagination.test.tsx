import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PoPagination } from "../src/components/po-list/po-pagination";

describe("PoPagination", () => {
  it("renders the current page, page count and item range", () => {
    render(<PoPagination page={2} pageSize={10} total={23} onPageChange={() => {}} />);
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("disables Prev on the first page", () => {
    render(<PoPagination page={1} pageSize={10} total={23} onPageChange={() => {}} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  it("disables Next on the last page", () => {
    render(<PoPagination page={3} pageSize={10} total={23} onPageChange={() => {}} />);
    expect(screen.getByLabelText("Next page")).toBeDisabled();
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
  });

  it("fires onPageChange with the next page when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(<PoPagination page={1} pageSize={10} total={23} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("fires onPageChange with the previous page when Prev is clicked", () => {
    const onPageChange = vi.fn();
    render(<PoPagination page={2} pageSize={10} total={23} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("clamps the indices when total is zero", () => {
    render(<PoPagination page={1} pageSize={10} total={0} onPageChange={() => {}} />);
    const wrapper = screen.getByTestId("po-pagination");
    expect(wrapper).toHaveTextContent("Showing 0–0 of 0");
  });
});
