"use client";

import { useState } from "react";

interface SoftSkillsSectionProps {
  skills: string[];
  portfolioLinks: { id: string; label: string; url: string }[];
}

export function SoftSkillsSection({
  skills: initialSkills,
  portfolioLinks: initialLinks,
}: SoftSkillsSectionProps) {
  const [skills, setSkills] = useState(initialSkills);
  const [links, setLinks] = useState(initialLinks);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newLink, setNewLink] = useState("");
  const [saved, setSaved] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks([...links, { id: `link-${Date.now()}`, label: "Website", url: newLink.trim() }]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Soft Skills & Portfolio Links</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-primary-600 text-sm font-medium hover:text-primary-700"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="text-verified-green text-sm font-medium hover:text-green-600"
          >
            {saved ? "Saved!" : "Save"}
          </button>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">Soft Skills</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-primary-400 hover:text-primary-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}
          {isEditing && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill..."
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Links */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Portfolio Links</p>
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-primary-600 hover:underline cursor-pointer flex-1">{link.url}</span>
              {isEditing && (
                <button
                  onClick={() => handleRemoveLink(link.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Add portfolio link..."
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === "Enter" && handleAddLink()}
              />
              <button
                onClick={handleAddLink}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Only Soft Skills and Portfolio Links can be edited. Government-verified data (Name, Passport, PIN, Education, Work History) is locked and cannot be modified.
      </p>
    </div>
  );
}
