"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Search,
  Trophy,
} from "lucide-react";

interface Profile {
  name?: string;
  [key: string]: any;
}

interface Career {
  title?: string;
  category?: string;
  [key: string]: any;
}

interface Props {
  profile: Profile;
  activeCareer: Career;
  setStep: (step: any) => void;
}

type Exam = {
  id: string;
  name: string;
  description: string;
  officialUrl: string;
};

type College = {
  id: string;
  name: string;
  type: string;
  state: string;
  branches: string[];
  exams: string[];
  minRank: number;
  maxRank: number;
};

const exams: Exam[] = [
  {
    id: "jee-main",
    name: "JEE Main",
    description: "Admission to NITs, IIITs and other participating institutes.",
    officialUrl: "https://jeemain.nta.nic.in/",
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced",
    description: "Admission to IITs.",
    officialUrl: "https://jeeadv.ac.in/",
  },
  {
    id: "bitsat",
    name: "BITSAT",
    description: "Admission to BITS Pilani campuses.",
    officialUrl: "https://www.bitsadmission.com/",
  },
  {
    id: "cuet",
    name: "CUET-UG",
    description: "Admission to participating central and other universities.",
    officialUrl: "https://cuet.nta.nic.in/",
  },
  {
    id: "viteee",
    name: "VITEEE",
    description: "Admission to VIT engineering programmes.",
    officialUrl: "https://viteee.vit.ac.in/",
  },
  {
    id: "mht-cet",
    name: "MHT-CET",
    description: "Engineering admissions in Maharashtra.",
    officialUrl: "https://cetcell.mahacet.org/",
  },
  {
    id: "wbjee",
    name: "WBJEE",
    description: "Engineering admissions in West Bengal.",
    officialUrl: "https://wbjeeb.nic.in/",
  },
];

const colleges: College[] = [
  {
    id: "iit-delhi",
    name: "IIT Delhi",
    type: "IIT",
    state: "Delhi",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["jee-advanced"],
    minRank: 1,
    maxRank: 5000,
  },
  {
    id: "iit-bombay",
    name: "IIT Bombay",
    type: "IIT",
    state: "Maharashtra",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["jee-advanced"],
    minRank: 1,
    maxRank: 5000,
  },
  {
    id: "iit-kanpur",
    name: "IIT Kanpur",
    type: "IIT",
    state: "Uttar Pradesh",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["jee-advanced"],
    minRank: 1,
    maxRank: 7000,
  },
  {
    id: "iit-madras",
    name: "IIT Madras",
    type: "IIT",
    state: "Tamil Nadu",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["jee-advanced"],
    minRank: 1,
    maxRank: 6000,
  },
  {
    id: "nit-trichy",
    name: "NIT Tiruchirappalli",
    type: "NIT",
    state: "Tamil Nadu",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["jee-main"],
    minRank: 1,
    maxRank: 30000,
  },
  {
    id: "nit-warangal",
    name: "NIT Warangal",
    type: "NIT",
    state: "Telangana",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["jee-main"],
    minRank: 1,
    maxRank: 35000,
  },
  {
    id: "iiit-hyderabad",
    name: "IIIT Hyderabad",
    type: "IIIT",
    state: "Telangana",
    branches: ["Computer Science", "Electronics"],
    exams: ["jee-main"],
    minRank: 1,
    maxRank: 20000,
  },
  {
    id: "bits-pilani",
    name: "BITS Pilani",
    type: "Private",
    state: "Rajasthan",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["bitsat"],
    minRank: 1,
    maxRank: 5000,
  },
  {
    id: "vit-vellore",
    name: "VIT Vellore",
    type: "Private",
    state: "Tamil Nadu",
    branches: ["Computer Science", "Electronics", "Mechanical Engineering"],
    exams: ["viteee"],
    minRank: 1,
    maxRank: 50000,
  },
  {
    id: "jadavpur",
    name: "Jadavpur University",
    type: "University",
    state: "West Bengal",
    branches: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    exams: ["wbjee"],
    minRank: 1,
    maxRank: 10000,
  },
];

function getChance(rank: number, college: College) {
  if (!rank || rank <= 0) {
    return {
      label: "Enter your rank",
      score: 0,
    };
  }

  if (rank <= college.minRank) {
    return {
      label: "Stretch",
      score: 50,
    };
  }

  if (rank <= college.maxRank * 0.45) {
    return {
      label: "High chance",
      score: 95,
    };
  }

  if (rank <= college.maxRank * 0.75) {
    return {
      label: "Moderate chance",
      score: 75,
    };
  }

  if (rank <= college.maxRank) {
    return {
      label: "Low chance",
      score: 45,
    };
  }

  return {
    label: "Low chance",
    score: 20,
  };
}

export default function CompetitiveCollegeSelectionStep({
  profile,
  activeCareer,
  setStep,
}: Props) {
  const [selectedExam, setSelectedExam] = useState("jee-main");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [homeState, setHomeState] = useState("");
  const [branch, setBranch] = useState("Computer Science");
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

  const selectedExamData = exams.find((exam) => exam.id === selectedExam);

  const recommendations = useMemo(() => {
    const numericRank = Number(rank);

    return colleges
      .filter((college) => college.exams.includes(selectedExam))
      .filter((college) => {
        if (!branch) return true;
        return college.branches.some((item) =>
          item.toLowerCase().includes(branch.toLowerCase())
        );
      })
      .filter((college) =>
        college.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((college) => ({
        ...college,
        chance: getChance(numericRank, college),
      }))
      .sort((a, b) => b.chance.score - a.chance.score);
  }, [selectedExam, rank, branch, search]);

  const selected = colleges.find(
    (college) => college.id === selectedCollege
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="rounded-2xl border bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white/15 p-3">
            <Trophy className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              College Selection Through Competitive Exams
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-blue-100">
              Select your competitive exam, enter your rank and preferences,
              and explore suitable colleges and branches.
            </p>

            {activeCareer?.title && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                <GraduationCap className="h-4 w-4" />
                Career: {activeCareer.title}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exam Selection */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">1. Select Competitive Exam</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => setSelectedExam(exam.id)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedExam === exam.id
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                  : "hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{exam.name}</div>
                  <p className="mt-1 text-xs text-gray-500">
                    {exam.description}
                  </p>
                </div>

                {selectedExam === exam.id && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedExamData && (
          <a
            href={selectedExamData.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            Official {selectedExamData.name} website
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </section>

      {/* Student Details */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">
            2. Enter Your Exam Details
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Rank / Score
            </label>
            <input
              type="number"
              min="1"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="Example: 12000"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>General</option>
              <option>OBC-NCL</option>
              <option>EWS</option>
              <option>SC</option>
              <option>ST</option>
              <option>PwD</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Home State
            </label>

            <input
              value={homeState}
              onChange={(e) => setHomeState(e.target.value)}
              placeholder="Example: Uttar Pradesh"
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Desired Branch
            </label>

            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
            >
              <option>Computer Science</option>
              <option>Electrical Engineering</option>
              <option>Electronics</option>
              <option>Mechanical Engineering</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Search College
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search IIT, NIT, IIIT, university..."
                className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              3. Recommended Colleges
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Based on the selected exam, rank and preferred branch.
            </p>
          </div>

          <div className="hidden rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 md:block">
            Category: {category}
          </div>
        </div>

        {!rank && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Enter your rank/score to get a more useful chance estimate.
          </div>
        )}

        <div className="grid gap-4">
          {recommendations.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
              No colleges found for the selected combination.
            </div>
          ) : (
            recommendations.map((college) => {
              const isSelected = selectedCollege === college.id;

              return (
                <div
                  key={college.id}
                  className={`rounded-xl border p-5 transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-4">
                      <div className="rounded-xl bg-gray-100 p-3">
                        <Building2 className="h-6 w-6 text-gray-700" />
                      </div>

                      <div>
                        <h3 className="font-semibold">{college.name}</h3>

                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>{college.type}</span>
                          <span>•</span>
                          <span>{college.state}</span>
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                          {branch}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          college.chance.label === "High chance"
                            ? "bg-green-100 text-green-700"
                            : college.chance.label === "Moderate chance"
                              ? "bg-yellow-100 text-yellow-700"
                              : college.chance.label === "Stretch"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {college.chance.label}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedCollege(college.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Selected College */}
      {selected && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 text-sm font-medium text-blue-600">
                Selected College
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {selected.name}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {branch} • {selected.state}
              </p>

              {homeState && (
                <p className="mt-1 text-xs text-gray-500">
                  Home State: {homeState}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStep("roadmap")}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Continue to Roadmap
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep("internships")}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                Explore Internships
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border bg-gray-50 p-4 text-xs leading-5 text-gray-500">
        <strong>Important:</strong> These recommendations are for guidance
        only. Actual admission depends on the official year's cutoff,
        counselling round, category, quota, home-state rules, seat
        availability and other eligibility conditions. Always verify the
        final result from the official counselling authority.
      </div>
    </div>
  );
}