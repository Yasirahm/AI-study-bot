import React, { useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { jsPDF } from "jspdf";

function StudyMode() {
  const [notes, setNotes] = useState("");
const [result, setResult] = useState("");
const [loading, setLoading] = useState(false);
const [pdfFile, setPdfFile] = useState(null);
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text("AI Study Notes", 20, 20);

    let y = 35;

    const addSection = (title, content) => {
      if (!content) return;

      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(16);
      doc.text(title, 20, y);
      y += 10;

      doc.setFontSize(12);
      const lines = doc.splitTextToSize(content, 170);

      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 20, y);
        y += 7;
      });
      y += 5;
    };

    addSection("Exam Summary", sections.summary);
    addSection("Key Revision Points", sections.points);
    addSection("Important Concepts", sections.concepts);
    addSection("MCQ Practice", sections.mcq);
    addSection("Possible Exam Questions", sections.questions);
    addSection("Memory Trick", sections.memory);

    doc.save("AI_Study_Notes.pdf");
  };
const generate = async () => {
  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("notes", notes);

    if (pdfFile) {
      formData.append("pdf", pdfFile);
    }

    const response = await axios.post(
      "http://localhost:5000/api/ai/study",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const cleanText = response.data.result.replace(/\*/g, "");

    setResult(cleanText);

  } catch (error) {
    console.log(error);
    setResult("Error generating study material");
  } finally {
    setLoading(false);
  }
};
  const getSections = (text) => {
    if (!text) return {};
    const sections = {
      summary: "",
      points: "",
      concepts: "",
      mcq: "",
      questions: "",
      memory: "",
    };

    const lines = text.split("\n");
    let current = "";

    lines.forEach((line) => {
      const lower = line.toLowerCase();
      if (lower.includes("exam summary")) current = "summary";
      else if (lower.includes("revision")) current = "points";
      else if (lower.includes("important concept")) current = "concepts";
      else if (lower.includes("mcq")) current = "mcq";
      else if (lower.includes("possible exam")) current = "questions";
      else if (lower.includes("memory")) current = "memory";

      if (current) sections[current] += line + "\n";
    });

    return sections;
  };

  const sections = getSections(result);

  const Card = ({ title, content, color }) => {
    if (!content) return null; // Don't show empty sections
    return (
      <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 md:p-8 shadow-xl hover:border-slate-500/50 transition-all duration-300">
        <h2 className={`text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 ${color}`}>
          {title}
        </h2>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4"></div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {content.trim()}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center px-4 py-8 md:py-16">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
            AI Study Assistant
          </h1>
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto">
            Transform your messy lecture notes into structured, exam-ready revision material in seconds.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-5 md:p-10 mb-10">
          <textarea
            className="w-full h-48 md:h-64 p-5 rounded-2xl bg-slate-900/80 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none text-sm md:text-base placeholder:text-slate-500"
            placeholder="Paste your lecture notes or textbook content here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
<input
  type="file"
  accept="application/pdf"
  onChange={(e) => setPdfFile(e.target.files[0])}
  className="mt-4 w-full text-sm text-gray-300
  file:mr-4 file:py-2 file:px-4
  file:rounded-lg file:border-0
  file:text-sm file:font-semibold
  file:bg-blue-600 file:text-white
  hover:file:bg-blue-500"
/>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <button
              onClick={generate}
              disabled={loading || !notes}
              className={`px-8 py-4 rounded-xl text-white font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                loading || !notes 
                  ? "bg-slate-700 cursor-not-allowed opacity-50" 
                  : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20"
              }`}
            >
              {loading ? "Processing..." : "✨ Generate Study Material"}
            </button>

            {result && !loading && (
              <button
                onClick={downloadPDF}
                className="bg-emerald-600 hover:bg-emerald-500 px-8 py-4 rounded-xl text-white font-bold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                📥 Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader />
              <p className="text-blue-400 animate-pulse font-medium">Analyzing your notes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Card
                title="📘 Exam Summary"
                content={sections.summary}
                color="text-blue-400"
              />
              <Card
                title="📌 Key Revision Points"
                content={sections.points}
                color="text-emerald-400"
              />
              <Card
                title="🧠 Important Concepts"
                content={sections.concepts}
                color="text-purple-400"
              />
              <Card
                title="❓ MCQ Practice"
                content={sections.mcq}
                color="text-yellow-400"
              />
              <Card
                title="📝 Possible Exam Questions"
                content={sections.questions}
                color="text-orange-400"
              />
              <Card
                title="🧩 Memory Trick"
                content={sections.memory}
                color="text-pink-400"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyMode;