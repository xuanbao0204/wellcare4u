import NotificationComposer from "@/features/notification/component/NotificationComposer";
import { getMyPatients } from "@/features/notification/notificationService";

export default function NotificationPage() {

  return (

    <div className="p-6">
      <NotificationComposer
        sendEndpoint="/doctor/notifications/send"
        allowedTargets={[
          "IDS",
        ]}
        receiverEndpoint="/doctor/notifications/my-patients"
      />

    </div>
  );
}
