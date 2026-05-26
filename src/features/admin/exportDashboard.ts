import api from "@/lib/axios";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export async function exportDashboardPdf(
    element: HTMLElement,
    filename = "dashboard-report.pdf"
) {
    const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;

    const usableWidth = pageWidth - margin * 2;

    const imgHeight =
        (canvas.height * usableWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(
        imgData,
        "PNG",
        margin,
        position,
        usableWidth,
        imgHeight
    );

    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;

        pdf.addPage();

        pdf.addImage(
            imgData,
            "PNG",
            margin,
            position,
            usableWidth,
            imgHeight
        );

        heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(filename);
}

export async function exportAnalyticsExcel() {

    const response = await api.get(
        "/admin/analytics/xlsx",
        {
            responseType: "blob",
        }
    );

    const blob = new Blob(
        [response.data],
        {
            type: response.headers["content-type"],
        }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "analytics-report.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
}