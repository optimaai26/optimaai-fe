import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("Modal Component", () => {
	it("does not render if isOpen is false", () => {
		render(
			<Modal isOpen={false} onClose={() => {}} title="Hidden">
				Content
			</Modal>,
		);
		expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
		expect(screen.queryByText("Content")).not.toBeInTheDocument();
	});

	it("renders accessibility features correctly when open", () => {
		render(
			<Modal
				isOpen={true}
				onClose={() => {}}
				title="Aria Modal"
				description="Sample desc"
			>
				Test text
			</Modal>,
		);

		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeInTheDocument();
		expect(dialog).toHaveAttribute("aria-modal", "true");
		expect(screen.getByText("Aria Modal")).toBeInTheDocument();
		expect(screen.getByText("Sample desc")).toBeInTheDocument();
		expect(screen.getByText("Test text")).toBeInTheDocument();
	});

	it("fires onClose when clicking the background overlay", () => {
		const onCloseMock = vi.fn();
		render(
			<Modal isOpen={true} onClose={onCloseMock} title="Click Test">
				Content
			</Modal>,
		);

		// The background overlay is the first div with a backdrop-blur
		const background =
			screen.getAllByRole("presentation")[0] ||
			screen.getByTestId("overlay") ||
			document.querySelector(".bg-black\\/50");

		if (background) {
			fireEvent.click(background);
			expect(onCloseMock).toHaveBeenCalledOnce();
		}
	});

	it("fires onClose when clicking the X icon", () => {
		const onCloseMock = vi.fn();
		render(
			<Modal isOpen={true} onClose={onCloseMock} title="X Button Test">
				Content
			</Modal>,
		);

		const closeButton = screen.getByLabelText("Close modal");
		fireEvent.click(closeButton);
		expect(onCloseMock).toHaveBeenCalledOnce();
	});
});
