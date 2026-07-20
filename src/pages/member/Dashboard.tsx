// pages/user/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import {
  MapPin,
  Plus,
  FileText,
  Mic,
  Briefcase,
  ShoppingBag,
  Clock,
  ChevronRight,
  BookOpen,
  Calendar,
  TrendingUp
} from "lucide-react";
const UserDashboard = () => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [timezone, setTimezone] = useState("UTC");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setTimezone(response.data.data.timezone || "UTC");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!timezone) return;

    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      });

      setCurrentTime(formatter.format(new Date()));
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone]);


  // Sample data
  const projects = [
    {
      id: 1,
      title: "Vice-Chancellor Annual Address",
      type: "Executive Speechwriting",
      status: "Drafting",
      progress: 65,
      dueDate: "15 Jul 2026",
    },
    {
      id: 2,
      title: "Climate Research Policy Brief",
      type: "Science Communication",
      status: "Client Review",
      progress: 85,
      dueDate: "20 Jul 2026",
    },
    {
      id: 3,
      title: "Annual Impact Report 2026",
      type: "Narrative Impact Development",
      status: "AI Processing",
      progress: 40,
      dueDate: "30 Jul 2026",
    },
  ];

  const workshops = [
    {
      id: 1,
      title: "Media Training Masterclass",
      date: "18 Jul",
      time: "09:00",
    },
    {
      id: 2,
      title: "Crisis Communication Bootcamp",
      date: "25 Jul",
      time: "08:30",
    },
    {
      id: 3,
      title: "Strategic Storytelling for Leaders",
      date: "08 Aug",
      time: "09:00",
    },
    {
      id: 4,
      title: "Public Relations Fundamentals",
      date: "15 Aug",
      time: "09:00",
    },
  ];

  const statusColors: Record<string, string> = {
    "Drafting": "bg-[#F3EDE6] text-[#C85A32]",
    "Client Review": "bg-blue-50 text-blue-600",
    "AI Processing": "bg-purple-50 text-purple-600",
    "Completed": "bg-green-50 text-green-600",
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-[1500px] mx-auto px-6 py-6 space-y-5">
        {/* Top Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-sm text-[#0F2D63]">Institutional Dashboard</p>
              <p className="text-xs text-gray-400">Wits University</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#F9F7F4] border border-gray-100 rounded-xl px-4 py-2">
            <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />

            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                {timezone === "UTC"
                  ? "UTC"
                  : timezone.split("/")[1]?.replace(/_/g, " ")}
              </p>

              <p className="text-sm font-bold text-[#0F2D63] tabular-nums leading-none">
                {currentTime}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-[#0F2D63] rounded-2xl overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(at 80% 50%, rgb(200, 90, 50) 0%, transparent 60%)",
            }}
          ></div>
          <div className="relative p-8 lg:p-10 flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              <span className="inline-block bg-[#C85A32] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Premium Plan
              </span>
              <h1 className="text-2xl lg:text-3xl font-['Roboto'] font-bold text-white mb-1.5">
                Good afternoon, Ronald
              </h1>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Wits University · VP Communications
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0F2D63] px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-[340px] shrink-0">
              <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/65 text-xs">AI Writing</p>
                </div>
                <p className="text-white font-bold text-2xl leading-none mb-1">∞</p>
                <p className="text-white/45 text-xs">Monthly limit</p>
              </div>

              <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                    <Mic className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/65 text-xs">AI Speech</p>
                </div>
                <p className="text-white font-bold text-2xl leading-none mb-1">AI</p>
                <p className="text-white/45 text-xs">Refine your voice</p>
              </div>

              <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/65 text-xs">Hire Expert</p>
                </div>
                <p className="text-white font-bold text-2xl leading-none mb-1">1</p>
                <p className="text-white/45 text-xs">Available now</p>
              </div>

              <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  </div>
                  <p className="text-white/65 text-xs">Toolkits</p>
                </div>
                <p className="text-white font-bold text-2xl leading-none mb-1">24</p>
                <p className="text-white/45 text-xs">Resources available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects & Workshops */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Active Projects */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F3EDE6] rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#C85A32]" />
                </div>
                <h2 className="font-semibold text-[#0F2D63] text-[15px]">Active Projects</h2>
              </div>
              <Link
                to="/user/projects"
                className="flex items-center gap-1 text-[#C85A32] text-xs font-semibold"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 space-y-3">
              {projects.map((project) => (
                <button
                  key={project.id}
                  className="w-full text-left border border-gray-100 rounded-xl p-4 hover:border-[#C85A32]/30 hover:bg-[#FFF8F5] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1C1C1C] truncate group-hover:text-[#C85A32] transition-colors">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{project.type}</p>
                    </div>
                    <span className={`ml-3 shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusColors[project.status] || "bg-gray-100 text-gray-600"}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="mb-2.5">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Progress</span>
                      <span className="font-medium text-[#0F2D63]">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C85A32] rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Due {project.dueDate}
                    </div>
                    <span className="flex items-center gap-1 text-[#C85A32] font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      View detail →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Workshops */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#F3EDE6] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#C85A32]" />
                </div>
                <h2 className="font-semibold text-[#0F2D63] text-[15px]">Workshops</h2>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-xl text-[#0F2D63]">4</span>
                <span className="text-sm text-gray-400">sessions available</span>
              </div>
              <p className="text-xs text-[#C85A32] font-medium mt-1">
                Professional development programmes
              </p>
            </div>

            <div className="px-5 pt-4 pb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0F2D63]" />
                  <h3 className="font-semibold text-sm text-[#0F2D63]">Upcoming Workshops</h3>
                </div>
                <Link
                  to="/user/workshops"
                  className="text-xs text-[#C85A32] font-semibold"
                >
                  View All
                </Link>
              </div>

              {workshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="border border-gray-100 rounded-xl p-3 mb-2 hover:bg-[#F9F7F4] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-xs text-[#1C1C1C]">{workshop.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {workshop.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {workshop.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;