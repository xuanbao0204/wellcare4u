import { CalendarX, FileText, InfoIcon, MessageCircleWarningIcon, SettingsIcon } from "lucide-react";

export default function getNotiTypeIcon(type: string) {
    switch (type) {
    case "INFO":
      return <InfoIcon size={32} className="text-blue-500" />;

    case "WARNING":
      return <MessageCircleWarningIcon size={32} className="text-yellow-500" />;

    case "APPOINTMENT_CANCELLED":
      return <CalendarX size={16} className="text-red-500" />;

    case "MEDICAL_RECORD_READY":
      return <FileText size={16} className="text-purple-500" />;

    default:
      return <SettingsIcon size={32} className="text-gray-400" />;
  }
}