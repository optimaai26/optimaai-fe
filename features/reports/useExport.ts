"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function useExport() {
	const { toast } = useToast();
	const [isExporting, setIsExporting] = useState(false);

	/**
	 * Helper to trigger a file download from a Blob
	 */
	const triggerDownload = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	/**
	 * Exports an array of objects to a CSV file.
	 */
	const exportAsCSV = async <T extends Record<string, any>>(
		data: T[],
		filename: string = "export.csv",
	) => {
		if (!data || data.length === 0) {
			toast({
				type: "error",
				title: "Export Failed",
				message: "No data available to export.",
			});
			return;
		}

		try {
			setIsExporting(true);
			const headers = Object.keys(data[0]);
			const csvContent = [
				headers.join(","),
				...data.map((row) =>
					headers
						.map(
							(fieldName) => `"${String(row[fieldName]).replace(/"/g, '""')}"`,
						)
						.join(","),
				),
			].join("\n");

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			triggerDownload(blob, filename);
			toast({
				type: "success",
				title: "Export Successful",
				message: `${filename} downloaded.`,
			});
		} catch (error) {
			toast({
				type: "error",
				title: "Export Failed",
				message: "An error occurred while exporting CSV.",
			});
		} finally {
			setIsExporting(false);
		}
	};

	/**
	 * Exports an array of objects or an object to a JSON file.
	 */
	const exportAsJSON = async (data: any, filename: string = "export.json") => {
		if (!data) {
			toast({
				type: "error",
				title: "Export Failed",
				message: "No data available to export.",
			});
			return;
		}

		try {
			setIsExporting(true);
			const jsonContent = JSON.stringify(data, null, 2);
			const blob = new Blob([jsonContent], {
				type: "application/json;charset=utf-8;",
			});
			triggerDownload(blob, filename);
			toast({
				type: "success",
				title: "Export Successful",
				message: `${filename} downloaded.`,
			});
		} catch (error) {
			toast({
				type: "error",
				title: "Export Failed",
				message: "An error occurred while exporting JSON.",
			});
		} finally {
			setIsExporting(false);
		}
	};

	return { exportAsCSV, exportAsJSON, isExporting };
}
