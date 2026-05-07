"use client";

import PatientInformationPage from "@/features/patient/profile/components/PatientInformation";
import PersonalProfile from "@/shared/sections/PersonalInformation";
import { useState } from "react";

const sections = [
    { id: "overview", label: "Tổng quan" },
    { id: "personal-information", label: "Thông tin cá nhân" },
    { id: "patient-details", label: "Thông tin thêm" },

] as const;

type SectionId = (typeof sections)[number]["id"];

const PatientProfilePage = () => {
    const [activeSection, setActiveSection] = useState<SectionId>(sections[0].id);

    const currentSection = sections.find((section) => section.id === activeSection) ?? sections[0];

    return (
        <div className="w-full bg-background text-foreground">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <aside className="rounded-2xl border border-primary/15 bg-white/90 p-4 shadow-sm">
                        <h1 className="mb-4 text-lg font-semibold text-primary">Doctor Profile</h1>
                        <nav className="space-y-2">
                            {sections.map((section) => {
                                const isActive = section.id === activeSection;

                                return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                                        isActive
                                            ? "border-primary/30 bg-primary/10 text-primary"
                                            : "border-transparent text-foreground/80 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                                    }`}
                                >
                                    {section.label}
                                </button>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="min-h-130 rounded-2xl border border-primary/15 bg-white/90 p-6 shadow-sm">
                        <div className="mb-4 border-b border-primary/10 pb-3">
                            <h2 className="text-xl font-semibold text-primary">{currentSection.label}</h2>
                        </div>
                        {activeSection === "overview" && (
                            <section className="h-105 rounded-xl border border-dashed border-primary/25 bg-primary/5 p-4">
                                <p className="text-sm text-foreground/70">Add your Overview content here.</p>
                            </section>
                        )}

                        {activeSection === "personal-information" && <PersonalProfile />}

                        {activeSection === "patient-details" && <PatientInformationPage />}

                        {/* {activeSection === "schedule" && (
                            <section className="h-105 rounded-xl border border-dashed border-primary/25 bg-primary/5 p-4">
                                <p className="text-sm text-foreground/70">Add your Schedule content here.</p>
                            </section>
                        )}

                        {activeSection === "settings" && (
                            <section className="h-105 rounded-xl border border-dashed border-primary/25 bg-primary/5 p-4">
                                <p className="text-sm text-foreground/70">Add your Settings content here.</p>
                            </section>
                        )} */}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PatientProfilePage;