"use client";

import { useState } from "react";

import {
    changePassword,
    deactiveAccount,
    deleteAccount,
} from "@/features/account/accountService";

import { showError, showSuccess } from "@/lib/toast";
import { parseApiError } from "@/lib/parseError";

import Loader from "@/shared/ui/Loader";
import FloatingInput from "../components/FloatingInput";

export default function DangerZoneSection() {

    const [saving, setSaving] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [deletePassword, setDeletePassword] = useState("");

    const handleChangePassword = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (
            !passwordForm.currentPassword ||
            !passwordForm.newPassword
        ) {
            showError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        setSaving(true);

        try {

            const res = await changePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );

            showSuccess(res.message);

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
            });

        } catch (err: any) {

            showError(parseApiError(err));

        } finally {

            setSaving(false);

        }
    };

    const handleDeactivate = async () => {

        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn vô hiệu hóa tài khoản?"
        );

        if (!confirmed) return;

        setSaving(true);

        try {

            const res = await deactiveAccount("");

            showSuccess(res.message);

        } catch (err: any) {

            showError(parseApiError(err));

        } finally {

            setSaving(false);

        }
    };

    const handleDelete = async () => {

        if (!deletePassword) {
            showError("Vui lòng nhập mật khẩu xác nhận.");
            return;
        }

        const confirmed = window.confirm(
            "Tài khoản sẽ bị xóa vĩnh viễn. Bạn chắc chắn muốn tiếp tục?"
        );

        if (!confirmed) return;

        setSaving(true);

        try {

            const res = await deleteAccount(deletePassword);

            showSuccess(res.message);

        } catch (err: any) {

            showError(parseApiError(err));

        } finally {

            setSaving(false);

        }
    };

    return (
        <section className="mx-auto w-full max-w-4xl">

            <div className="rounded-3xl border border-red-200 bg-white/80 backdrop-blur-md shadow-xl p-8">

                {/* Header */}
                <div>
                    <h3 className="text-xl font-semibold text-red-600">
                        Danger Zone
                    </h3>

                    <p className="mt-1 text-sm text-foreground/60 py-2">
                        Các hành động dưới đây có thể ảnh hưởng nghiêm trọng đến tài khoản của bạn.
                    </p>
                </div>

                {/* Change password */}
                <form
                    onSubmit={handleChangePassword}
                    className="space-y-6 pt-6"
                >

                    <div className="rounded-2xl border border-gray-200 bg-white p-6">

                        <div className="mb-5">
                            <h4 className="text-lg font-semibold text-primary">
                                Đổi mật khẩu
                            </h4>

                            <p className="mt-1 text-sm text-gray-500">
                                Thay đổi mật khẩu để tăng cường bảo mật tài khoản.
                            </p>
                        </div>

                        <div className="space-y-5">

                            <FloatingInput
                                label="Mật khẩu hiện tại"
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                    setPasswordForm({
                                        ...passwordForm,
                                        currentPassword: e.target.value,
                                    })
                                }
                            />

                            <FloatingInput
                                label="Mật khẩu mới"
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                    setPasswordForm({
                                        ...passwordForm,
                                        newPassword: e.target.value,
                                    })
                                }
                            />

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                            >
                                {saving ? <Loader /> : "Đổi mật khẩu"}
                            </button>

                        </div>
                    </div>
                </form>

                <hr className="my-8 border-t border-red-100" />

                {/* Deactivate account */}
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50/70 p-6">

                    <div className="mb-5">
                        <h4 className="text-lg font-semibold text-yellow-700">
                            Vô hiệu hóa tài khoản
                        </h4>

                        <p className="mt-1 text-sm text-yellow-700/80">
                            Tài khoản sẽ bị tạm khóa và có thể kích hoạt lại sau này.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleDeactivate}
                        disabled={saving}
                        className="rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                    >
                        {saving ? <Loader /> : "Vô hiệu hóa tài khoản"}
                    </button>
                </div>

                <hr className="my-8 border-t border-red-100" />

                {/* Delete account */}
                <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6">

                    <div className="mb-5">
                        <h4 className="text-lg font-semibold text-red-600">
                            Xóa tài khoản
                        </h4>

                        <p className="mt-1 text-sm text-red-500">
                            Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
                        </p>
                    </div>

                    <div className="space-y-5">

                        <FloatingInput
                            label="Nhập mật khẩu để xác nhận"
                            type="password"
                            value={deletePassword}
                            onChange={(e) =>
                                setDeletePassword(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={saving}
                            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {saving ? <Loader /> : "Xóa tài khoản"}
                        </button>

                    </div>
                </div>
            </div>
        </section>
    );
}