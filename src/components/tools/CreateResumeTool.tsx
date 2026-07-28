import React, { useState } from 'react';
import { ArrowLeft, Briefcase, User, GraduationCap, Code, Sparkles, Download, FileText, Share2, ExternalLink } from 'lucide-react';
import { ProcessedHistoryItem } from '../../types';
import { convertTextToPdf } from '../../utils/pdfEngine';

interface CreateResumeToolProps {
  onBack: () => void;
  onAddHistory: (item: ProcessedHistoryItem) => void;
  onOpenPreview: (dataUrl: string, fileName: string, bytes?: number) => void;
}

export const CreateResumeTool: React.FC<CreateResumeToolProps> = ({
  onBack,
  onAddHistory,
  onOpenPreview,
}) => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer & Product Lead');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [location, setLocation] = useState('San Francisco, CA');
  const [summary, setSummary] = useState(
    'Passionate software leader with 6+ years of experience building scalable web applications, real-time systems, and user-centric web products.'
  );

  const [experience, setExperience] = useState([
    {
      company: 'TechCorp Solutions',
      role: 'Lead Developer',
      duration: '2022 - Present',
      description: 'Led a team of 8 engineers delivering high-performance cloud tools and PDF processing engines.',
    },
    {
      company: 'Innovate Studio',
      role: 'Full Stack Engineer',
      duration: '2020 - 2022',
      description: 'Built responsive React applications, integrated AI REST endpoints, and optimized performance by 40%.',
    },
  ]);

  const [education, setEducation] = useState('B.S. in Computer Science - State University (2016 - 2020)');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, Express, Tailwind CSS, Gemini AI, Git, System Design');

  const [template, setTemplate] = useState<'modern' | 'executive' | 'minimal'>('modern');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAiEnhanceSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a compelling 3-sentence professional summary for a ${jobTitle} named ${fullName} with skills in ${skills}.`,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setSummary(data.text.trim());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const generateResumePdf = () => {
    const resumeText = `
================================================================================
${fullName.toUpperCase()}
${jobTitle}
================================================================================
Email: ${email}  |  Phone: ${phone}  |  Location: ${location}

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
${summary}

--------------------------------------------------------------------------------
WORK EXPERIENCE
--------------------------------------------------------------------------------
${experience
  .map(
    (exp) =>
      `• ${exp.role} @ ${exp.company} (${exp.duration})\n  ${exp.description}`
  )
  .join('\n\n')}

--------------------------------------------------------------------------------
EDUCATION
--------------------------------------------------------------------------------
${education}

--------------------------------------------------------------------------------
KEY SKILLS
--------------------------------------------------------------------------------
${skills}
`;

    const fileName = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    const pdfBytes = convertTextToPdf(resumeText, `${fullName} - Resume`);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const dataUrl = URL.createObjectURL(blob);

    onAddHistory({
      id: `resume-${Date.now()}`,
      title: `${fullName} - Professional Resume`,
      toolId: 'create-resume',
      timestamp: Date.now(),
      sizeBytes: pdfBytes.byteLength,
      dataUrl,
      fileName,
    });

    onOpenPreview(dataUrl, fileName, pdfBytes.byteLength);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello! Here is the resume for ${fullName} (${jobTitle}). Contact: ${email}`
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">AI Resume Builder</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create professional resumes with instant PDF export & direct sharing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a
            href="https://www.canva.com/create/resumes/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Canva</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Controls */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Professional Summary</label>
              <button
                onClick={handleAiEnhanceSummary}
                disabled={isGeneratingAi}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isGeneratingAi ? 'Enhancing...' : 'AI Enhance'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pt-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Education & Skills</span>
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Education Details</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Key Skills (Comma Separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            onClick={generateResumePdf}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Generate & Export Resume PDF</span>
          </button>
        </div>

        {/* Live Resume Sheet Preview */}
        <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="bg-white text-slate-900 p-6 rounded-xl shadow-xl space-y-4 font-sans text-xs min-h-[480px]">
            <div className="border-b-2 border-slate-900 pb-3">
              <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">{fullName}</h1>
              <p className="text-sm font-semibold text-blue-700">{jobTitle}</p>
              <div className="text-[10px] text-slate-500 flex flex-wrap gap-3 mt-1">
                <span>{email}</span>
                <span>• {phone}</span>
                <span>• {location}</span>
              </div>
            </div>

            <div>
              <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
                Summary
              </h2>
              <p className="text-slate-600 mt-1 leading-relaxed">{summary}</p>
            </div>

            <div>
              <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
                Experience
              </h2>
              <div className="space-y-2 mt-1">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{exp.role} - {exp.company}</span>
                      <span className="text-slate-500 font-normal">{exp.duration}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-[11px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1">
                Skills
              </h2>
              <p className="text-slate-600 mt-1 font-mono text-[10px]">{skills}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
