import React, { useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { jsPDF } from "jspdf";
import Footer from "./Footer";

function StudyMode() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post("http://localhost:5000/api/ai/study", {
        notes,
      });
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
    if (!content) return null;
    return (
      <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl p-5 md:p-8 shadow-2xl transition-all">
        <h2 className={`text-xl md:text-2xl font-bold mb-4 ${color}`}>
          {title}
        </h2>
        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {content.trim()}
        </p>
      </div>
    );
  };

  return (
  // Full viewport width
  <div className="min-h-screen  bg-slate-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black px-3 sm:px-6 lg:px-10 py-6 md:py-12">

    {/* Container */}
    <div className="w-full max-w-7xl mx-auto">

      {/* Header Section */}
      <div className="text-center w-full mb-8 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          AI Study Assistant
        </h1>

        <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-2">
          Paste your notes below and let AI structure your revision.
        </p>
      </div>

      {/* Input Area Card */}
      <div className="w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 mb-8 shadow-2xl">

        <textarea
          className="w-full h-48 md:h-72 p-4 md:p-6 rounded-xl bg-slate-900/90 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm sm:text-base"
          placeholder="Paste lecture notes, textbook content, or exam material here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Button Grid */}
        <div className="grid grid-cols-1 sm:flex sm:justify-center gap-4 mt-6">

          <button
            onClick={generate}
            disabled={loading || !notes}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-bold transition-all transform active:scale-95 ${
              loading || !notes
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
            }`}
          >
            {loading ? "Generating..." : "Generate Study Material"}
          </button>

          {result && !loading && (
            <button
              onClick={downloadPDF}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-bold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              Download PDF
            </button>
          )}

        </div>
      </div>

      {/* Results Area */}
<div className="w-full">

  {loading ? (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader />
      <p className="text-blue-400 mt-4 font-medium animate-pulse">
        Processing Information...
      </p>
    </div>
  ) : (

    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 w-full">

      <Card title="📘 Exam Summary" content={sections.summary} color="text-blue-400" />

      <Card title="📌 Key Revision Points" content={sections.points} color="text-green-400" />

      <Card title="🧠 Important Concepts" content={sections.concepts} color="text-purple-400" />

      <Card title="❓ MCQ Practice" content={sections.mcq} color="text-yellow-400" />

      <Card title="📝 Possible Exam Questions" content={sections.questions} color="text-orange-400" />

      <Card title="🧩 Memory Trick" content={sections.memory} color="text-pink-400" />

    </div>

  )}

</div>
    </div>
     <Footer />
  </div>
);
}

export default StudyMode;