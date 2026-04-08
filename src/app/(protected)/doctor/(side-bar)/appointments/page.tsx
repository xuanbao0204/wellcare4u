"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

type Appointment = {
  id: number;
  patientName: string;
  time: string;
  place: string;
  status: "PENDING" | "APPROVED" | "CANCELED" | "COMPLETED";
};

export default function AppointmentsPage() {
  const [data] = useState<Appointment[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const statusClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-blue-50 text-blue-600 border-blue-300";
      case "CANCELED":
        return "bg-red-50 text-red-500 border-red-300";
      case "COMPLETED":
        return "bg-green-50 text-green-600 border-green-300";
      default:
        return "bg-gray-50 text-gray-500 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary">
        Danh sách lịch hẹn
      </h2>

      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Bệnh nhân</th>
              <th className="p-3 text-center">Thời gian</th>
              <th className="p-3 text-center">Địa điểm</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {data.map((a) => {
              const isPending = a.status === "PENDING";
              const isApproved = a.status === "APPROVED";

              return (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.patientName}</td>
                  <td className="p-3 text-center">{a.time}</td>
                  <td className="p-3 text-center">{a.place}</td>

                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full border text-xs ${statusClass(a.status)}`}>
                      {a.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-center">

                      {isPending && (
                        <>
                          <button className="rounded-full border px-3 py-1 hover:bg-green-50">
                            Xác nhận
                          </button>
                          <button className="rounded-full border px-3 py-1 hover:bg-red-50">
                            Từ chối
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button className="rounded-full bg-primary px-4 py-1 text-white hover:bg-primary/90">
                          Bắt đầu khám
                        </button>
                      )}

                      <div className="relative">
                        <button
                          onClick={() =>
                            setMenuOpenId(menuOpenId === a.id ? null : a.id)
                          }
                          className="rounded-full border p-2 hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {menuOpenId === a.id && (
                          <div className="absolute right-0 mt-2 w-36 rounded-xl border bg-white shadow-lg">
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                              Xem
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { MoreVertical } from "lucide-react";

// type Appointment = {
//   id: number;
//   patientName: string;
//   time: string;
//   place: string;
//   status: string;
// };

// function Modal({
//   open,
//   onClose,
//   title,
//   children,
// }: {
//   open: boolean;
//   onClose: () => void;
//   title?: string;
//   children: React.ReactNode;
// }) {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//       <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-primary">{title}</h3>
//           <button
//             onClick={onClose}
//             className="rounded-lg px-2 py-1 hover:bg-gray-100"
//           >
//             ✕
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// export default function AppointmentsPage() {
//   const [q, setQ] = useState("");
//   const [data] = useState<Appointment[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

//   const statusClass = (status: string) => {
//     switch (status) {
//       case "APPROVED":
//         return "bg-blue-50 text-blue-600 border-blue-300";
//       case "CANCELED":
//         return "bg-red-50 text-red-500 border-red-300";
//       case "COMPLETED":
//         return "bg-green-50 text-green-600 border-green-300";
//       default:
//         return "bg-gray-50 text-gray-500 border-gray-300";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-primary">
//           Danh sách lịch hẹn
//         </h2>

//         <div className="flex items-center gap-3">
//           <input
//             className="w-64 rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="Tìm kiếm..."
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//           />

//           <button
//             onClick={() => setOpen(true)}
//             className="rounded-xl bg-primary px-5 py-2 text-white font-medium hover:bg-primary/90"
//           >
//             + Tạo lịch
//           </button>
//         </div>
//       </div>

//       <div className="rounded-2xl border overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50 text-gray-600">
//             <tr>
//               <th className="p-3 text-left">Bệnh nhân</th>
//               <th className="p-3 text-center">Thời gian</th>
//               <th className="p-3 text-center">Địa điểm</th>
//               <th className="p-3 text-center">Trạng thái</th>
//               <th className="p-3 text-center">Thao tác</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.length === 0 ? (
//               <tr>
//                 <td colSpan={5} className="p-6 text-center text-gray-500">
//                   Không có dữ liệu
//                 </td>
//               </tr>
//             ) : (
//               data.map((a) => (
//                 <tr key={a.id} className="border-t hover:bg-gray-50">
//                   <td className="p-3">{a.patientName}</td>
//                   <td className="p-3 text-center">{a.time}</td>
//                   <td className="p-3 text-center">{a.place}</td>

//                   <td className="p-3 text-center">
//                     <span
//                       className={`px-3 py-1 rounded-full border text-xs ${statusClass(
//                         a.status
//                       )}`}
//                     >
//                       {a.status}
//                     </span>
//                   </td>

//                   <td className="p-3">
//                     <div className="flex items-center gap-2">
//                       <div className="flex gap-2 flex-1 justify-center">
//                         <button className="rounded-full border px-3 py-1 hover:bg-green-50">
//                           Xác nhận
//                         </button>
//                         <button className="rounded-full border px-3 py-1 hover:bg-red-50">
//                           Từ chối
//                         </button>
//                         <button className="rounded-full border px-3 py-1 hover:bg-blue-50">
//                           Hoàn thành
//                         </button>
//                       </div>

//                       <div className="relative">
//                         <button
//                           onClick={() =>
//                             setMenuOpenId(menuOpenId === a.id ? null : a.id)
//                           }
//                           className="rounded-full border p-2 hover:bg-gray-100"
//                         >
//                           <MoreVertical className="w-4 h-4 text-gray-600" />
//                         </button>

//                         {menuOpenId === a.id && (
//                           <div className="absolute right-0 mt-2 w-36 rounded-xl border bg-white shadow-lg">
//                             <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
//                               Chỉnh sửa
//                             </button>
//                             <button className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50">
//                               Xóa
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Modal open={open} onClose={() => setOpen(false)} title="Tạo lịch hẹn">
//         <div className="space-y-3">
//           <input className="w-full rounded-xl border px-3 py-2" placeholder="Patient ID" />
//           <input className="w-full rounded-xl border px-3 py-2" placeholder="Địa điểm" />
//           <input type="date" className="w-full rounded-xl border px-3 py-2" />
//           <input type="time" className="w-full rounded-xl border px-3 py-2" />
//           <button className="w-full rounded-xl bg-primary py-2 text-white">
//             Tạo
//           </button>
//         </div>
//       </Modal>

//       <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Chỉnh sửa">
//         <div className="space-y-3">
//           <input className="w-full rounded-xl border px-3 py-2" />
//           <input className="w-full rounded-xl border px-3 py-2" />
//           <button className="w-full rounded-xl bg-green-600 py-2 text-white">
//             Lưu
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }