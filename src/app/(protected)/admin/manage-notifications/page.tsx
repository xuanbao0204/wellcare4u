import NotificationComposer from "@/features/notification/component/NotificationComposer";

export default function NotificationPage() {

  return (

    <div className="p-6">
      <NotificationComposer
        sendEndpoint="/admin/notifications/send"
        allowedTargets={[
          "BROADCAST",
          "ROLE"
        ]}
        receiverEndpoint="/admin/notifications/get-recipients"
      />

    </div>
  );
}
