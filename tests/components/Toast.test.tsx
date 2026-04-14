import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useToast } from "@/components/ui/Toast";

describe("Toast Component", () => {
	beforeEach(() => {
		useToast.getState().clear();
	});

	it("should be empty initially", () => {
		render(<Toast />);
		const lists = screen.queryAllByRole("listitem");
		expect(lists.length).toBe(0);
	});

	it("should render a success toast based on state", () => {
		render(<Toast />);

		act(() => {
			useToast.getState().toast({
				type: "success",
				title: "Task Formatted",
				message: "It worked",
			});
		});

		expect(screen.getByText("Task Formatted")).toBeInTheDocument();
		expect(screen.getByText("It worked")).toBeInTheDocument();
	});

	it("should automatically dismiss the toast", async () => {
		render(<Toast />);

		act(() => {
			useToast
				.getState()
				.toast({ type: "info", title: "Ephemeral", duration: 10 });
		});

		expect(screen.getByText("Ephemeral")).toBeInTheDocument();

		await new Promise((r) => setTimeout(r, 50));

		expect(screen.queryByText("Ephemeral")).not.toBeInTheDocument();
	});
});
