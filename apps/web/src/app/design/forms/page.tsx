"use client";

import { useState } from "react";
import {
  TextInput, DateInput, Select, Combobox, CascadingCombobox, Segmented,
  RadioCards, MultiSelect, PasswordWithVerify, FileUpload, type Option,
} from "@/components/forms";

// Verification showcase for the Gate O.2 form primitives (dev/design only).
const DISTRICTS: Option[] = [
  { value: "kampala", label: "Kampala" }, { value: "wakiso", label: "Wakiso" },
  { value: "mukono", label: "Mukono" }, { value: "jinja", label: "Jinja" },
];
const SUBCOUNTIES: Record<string, Option[]> = {
  kampala: [{ value: "kla_central", label: "Kampala Central Division" }, { value: "kla_nakawa", label: "Nakawa Division" }],
  wakiso: [{ value: "wak_kira", label: "Kira" }, { value: "wak_nansana", label: "Nansana" }],
};
const COUNCILS: Option[] = [
  { value: "umdpc", label: "UMDPC — Medical & Dental" }, { value: "unmc", label: "UNMC — Nurses & Midwives" },
  { value: "pbu", label: "Pharmacy Board of Uganda" }, { value: "ahpc", label: "AHPC — Allied Health" },
];
const EMPLOYMENT: Option[] = [{ value: "full_time", label: "Full-time" }, { value: "visiting", label: "Visiting" }, { value: "locum", label: "Locum" }];
const CARE: Option[] = [
  { value: "yes", label: "Yes, at a hospital", hint: "We'll ask which one and route a link request." },
  { value: "self", label: "No — I want to self-monitor", hint: "Straight to your dashboard." },
  { value: "soon", label: "Not yet, about to visit", hint: "Soft association, no verified link." },
];
const QUALS: Option[] = ["MBChB", "MMed", "MPH", "Fellowship", "PhD"].map((q) => ({ value: q, label: q }));

export default function FormsShowcase() {
  const [text, setText] = useState("");
  const [dob, setDob] = useState("");
  const [council, setCouncil] = useState("");
  const [district, setDistrict] = useState("");
  const [geo, setGeo] = useState({ parent: "", child: "" });
  const [emp, setEmp] = useState("full_time");
  const [care, setCare] = useState("");
  const [quals, setQuals] = useState<string[]>(["MBChB"]);
  const [pw, setPw] = useState(""); const [pv, setPv] = useState("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <main className="bg-surface-page min-h-dvh px-6 py-12">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <h1 className="text-content-primary text-xl font-bold tracking-tight">Form primitives — O.2</h1>
        <TextInput label="First name" required value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Amina" />
        <DateInput label="Date of birth" required value={dob} onChange={(e) => setDob(e.target.value)} />
        <Select label="Council" required options={COUNCILS} value={council} onChange={setCouncil} placeholder="Select a council" />
        <Combobox label="District" required options={DISTRICTS} value={district} onChange={setDistrict} />
        <CascadingCombobox parentLabel="District" parentOptions={DISTRICTS} childLabel="Subcounty"
          childOptionsByParent={SUBCOUNTIES} value={geo} onChange={setGeo} required />
        <Segmented label="Employment type" required options={EMPLOYMENT} value={emp} onChange={setEmp} />
        <RadioCards label="Are you currently a patient at a hospital?" required options={CARE} value={care} onChange={setCare} />
        <MultiSelect label="Qualifications" options={QUALS} value={quals} onChange={setQuals} hint="Select all that apply." />
        <PasswordWithVerify value={pw} verify={pv} onChange={setPw} onVerifyChange={setPv} required />
        <FileUpload label="Practising licence" required value={file} onChange={setFile} />
      </div>
    </main>
  );
}
