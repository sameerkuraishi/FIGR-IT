"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Search,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  Career,
  CoreSkill,
  StudentProfile,
} from "@/lib/figr-product";

type Status =
  | "Saved"
  | "Applied"
  | "Interview"
  | "Selected"
  | "Rejected";

type Internship = {
  id: string;
  company: string;
  role: string;
  location: string;
  mode: "Remote" | "Hybrid" | "On-site";
  duration: string;
  stipend: string;
  skills: CoreSkill[];
  category: Career["category"];
};

const internships: Internship[] = [
  {
    id: "i1",
    company: "TechNova Labs",
    role: "AI / ML Intern",
    location: "Bengaluru",
    mode: "Hybrid",
    duration: "3 months",
    stipend: "₹20,000/month",
    skills: [
      "Problem Solving",
      "Analytical Thinking",
      "Communication",
    ],
    category: "Technology & Engineering",
  },
  {
    id: "i2",
    company: "WebCraft Studio",
    role: "Frontend Developer Intern",
    location: "Remote",
    mode: "Remote",
    duration: "4 months",
    stipend: "₹15,000/month",
    skills: [
      "Problem Solving",
      "Communication",
      "Creativity",
    ],
    category: "Technology & Engineering",
  },
  {
    id: "i3",
    company: "DataBridge",
    role: "Data Analyst Intern",
    location: "Pune",
    mode: "Hybrid",
    duration: "6 months",
    stipend: "₹18,000/month",
    skills: [
      "Analytical Thinking",
      "Problem Solving",
      "Communication",
    ],
    category: "Technology & Engineering",
  },
  {
    id: "i4",
    company: "FinEdge",
    role: "Finance Analyst Intern",
    location: "Mumbai",
    mode: "On-site",
    duration: "3 months",
    stipend: "₹18,000/month",
    skills: [
      "Analytical Thinking",
      "Communication",
    ],
    category: "Commerce & Finance",
  },
  {
    id: "i5",
    company: "CreativeHouse",
    role: "UI/UX Design Intern",
    location: "Remote",
    mode: "Remote",
    duration: "3 months",
    stipend: "₹12,000/month",
    skills: [
      "Creativity",
      "Communication",
      "Problem Solving",
    ],
    category: "Creative & Media",
  },
];
interface InternshipStepProps {
  profile: StudentProfile;
  activeCareer: Career;
  effectiveSkills: Record<CoreSkill, number>;
  setStep: (step: any) => void;
}

export function InternshipStep({
  profile,
  activeCareer,
  effectiveSkills,
  setStep,
}: InternshipStepProps) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [status, setStatus] = useState<
    Record<string, Status>
  >({});

  const matches = useMemo(() => {
    return internships
      .filter(
        (item) =>
          item.category === activeCareer.category ||
          activeCareer.category ===
            "Technology & Engineering"
      )
      .filter(
        (item) =>
          mode === "All" || item.mode === mode
      )
      .filter((item) =>
        `${item.company} ${item.role} ${item.location}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .map((item) => {
        const total = item.skills.reduce(
          (sum, skill) =>
            sum + (effectiveSkills[skill] || 0),
          0
        );

        const match = Math.min(
          98,
          Math.max(
            35,
            Math.round(
              (total /
                (item.skills.length * 10)) *
                100
            )
          )
        );

        return {
          ...item,
          match,
        };
      })
      .sort(
        (a, b) => b.match - a.match
      );
  }, [
    activeCareer,
    effectiveSkills,
    mode,
    search,
  ]);

  const updateStatus = (
    id: string,
    value: Status
  ) => {
    setStatus((current) => ({
      ...current,
      [id]: value,
    }));
  };

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">

      {/* HEADER */}

      <section className="premium-card p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--winter-primary)]">
              Career → Internship
            </p>

            <h1 className="mt-2 text-3xl font-heading font-semibold text-[var(--winter-dark)]">
              Internship Opportunities
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">
              Internships matched with your career,
              skills and learning roadmap.
            </p>
          </div>

          <div className="rounded-2xl bg-[var(--winter-bg)] p-4 text-center">
            <BriefcaseBusiness className="mx-auto h-7 w-7 text-[var(--winter-primary)]" />

            <p className="mt-1 text-xs font-semibold">
              {matches.length} matches
            </p>
          </div>

        </div>
      </section>

      {/* CONNECTION */}

      <section className="grid gap-4 md:grid-cols-3">

        <div className="premium-card p-5">
          <GraduationCap className="h-5 w-5 text-[var(--winter-primary)]" />

          <p className="mt-3 text-xs text-muted-foreground">
            Target career
          </p>

          <h3 className="font-bold">
            {activeCareer.title}
          </h3>
        </div>

        <div className="premium-card p-5">
          <CheckCircle2 className="h-5 w-5 text-[var(--winter-success)]" />

          <p className="mt-3 text-xs text-muted-foreground">
            Recommended flow
          </p>

          <h3 className="font-bold">
            Roadmap → Skills → Apply
          </h3>
        </div>

        <div className="premium-card p-5">
          <UsersRound className="h-5 w-5 text-[var(--winter-primary)]" />

          <p className="mt-3 text-xs text-muted-foreground">
            Network
          </p>

          <h3 className="font-bold">
            Alumni referral
          </h3>
        </div>

      </section>

      {/* SEARCH */}

      <section className="premium-card p-5">

        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search internship, company or city..."
              className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none"
            />

          </div>

          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value)
            }
            className="rounded-xl border bg-white px-4 py-3 text-sm"
          >
            <option value="All">
              All
            </option>

            <option value="Remote">
              Remote
            </option>

            <option value="Hybrid">
              Hybrid
            </option>

            <option value="On-site">
              On-site
            </option>
          </select>

        </div>

      </section>

      {/* INTERNSHIPS */}

      <section className="grid gap-5 lg:grid-cols-2">

        {matches.map((internship) => (
          <article
            key={internship.id}
            className="premium-card p-6 transition hover:-translate-y-1"
          >

            {/* TITLE */}

            <div className="flex justify-between gap-4">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--secondary)] text-[var(--winter-primary)]">
                  <Building2 />
                </div>

                <div>

                  <h2 className="font-bold text-[var(--winter-dark)]">
                    {internship.role}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {internship.company}
                  </p>

                </div>

              </div>

              <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                {internship.match}% match
              </span>

            </div>

            {/* DETAILS */}

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">

              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {internship.location}
              </span>

              <span>
                {internship.mode}
              </span>

              <span>
                {internship.duration}
              </span>

              <span>
                {internship.stipend}
              </span>

            </div>

            {/* SKILLS */}

            <div className="mt-5">

              <p className="mb-2 text-xs font-bold uppercase tracking-wider">
                Required skills
              </p>

              <div className="flex flex-wrap gap-2">

                {internship.skills.map(
                  (skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-[var(--secondary)] px-2.5 py-1 text-xs"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>

            {/* LOW MATCH */}

            {internship.match < 70 && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <strong>
                  Roadmap recommendation:
                </strong>{" "}
                strengthen the required skills
                before applying.
              </div>
            )}

            {/* STATUS */}

            {status[internship.id] && (
              <div className="mt-4 rounded-xl bg-[var(--secondary)] p-3 text-sm font-semibold">
                Application status:{" "}
                {status[internship.id]}
              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-5 flex flex-wrap gap-2">

              <Button
                variant="outline"
                onClick={() =>
                  toggleSaved(
                    internship.id
                  )
                }
              >
                {saved.includes(
                  internship.id
                )
                  ? "Saved"
                  : "Save"}
              </Button>

              <Button
                onClick={() =>
                  updateStatus(
                    internship.id,
                    "Applied"
                  )
                }
              >
                Apply

                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  updateStatus(
                    internship.id,
                    "Interview"
                  )
                }
              >
                Interview
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setStep("alumni")
                }
              >
                <UsersRound className="mr-2 h-4 w-4" />

                Ask Alumni
              </Button>

            </div>

          </article>
        ))}

      </section>

      {/* APPLICATION TRACKER */}

      <section className="premium-card p-6">

        <h2 className="text-xl font-bold">
          Application Tracker
        </h2>

        <div className="mt-5 grid gap-3 grid-cols-2 md:grid-cols-5">

          {(
            [
              "Saved",
              "Applied",
              "Interview",
              "Selected",
              "Rejected",
            ] as Status[]
          ).map((item) => {

            const count =
              Object.values(status).filter(
                (value) =>
                  value === item
              ).length +
              (item === "Saved"
                ? saved.length
                : 0);

            return (
              <div
                key={item}
                className="rounded-xl bg-[var(--secondary)] p-4"
              >
                <p className="text-xs text-muted-foreground">
                  {item}
                </p>

                <strong className="text-2xl">
                  {count}
                </strong>
              </div>
            );
          })}

        </div>

      </section>

      {/* PLACEMENT CONNECTION */}

      <section className="rounded-3xl bg-[var(--winter-dark)] p-6 text-white md:p-8">

        <p className="text-xs font-bold uppercase tracking-widest text-white/60">
          Internship → Placement
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Turn internship experience into placement evidence
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Your internship projects, skills and
          experience can later be used for
          resume building, placement preparation
          and job recommendations.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">

          <Button
            onClick={() =>
              setStep("roadmap")
            }
            className="bg-white text-[var(--winter-dark)] hover:bg-white/90"
          >
            Update Roadmap
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setStep("alumni")
            }
            className="border-white/20 text-white hover:bg-white/10"
          >
            Connect with Alumni
          </Button>

        </div>

      </section>

    </div>
  );
}