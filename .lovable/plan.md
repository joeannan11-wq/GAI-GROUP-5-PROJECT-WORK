

## Plan: Create User Guide/Manual as DOCX

Generate a comprehensive Word document (DOCX) covering user guide, setup instructions, ethical considerations, and limitations for the AI-POWERED STUDENT DIAGNOSTIC & FEEDBACK platform.

### Document Structure

**Section 1 — Introduction**
- Project overview, purpose, and target audience (teachers and students in Ghana)

**Section 2 — System Requirements & Setup**
- Browser requirements, internet access, supported devices
- How to access the platform URL
- Account creation steps for teachers and students (with school selection)
- Email verification process

**Section 3 — Teacher User Guide**
- Dashboard overview (stats, recent exams)
- Creating an exam (Upload, AI Generate, Question Bank tabs)
- Publishing exams with access codes
- Viewing results and remarking
- Settings

**Section 4 — Student User Guide**
- Student dashboard (available/in-progress/completed exams)
- Taking an exam via dashboard or access code portal
- Viewing results

**Section 5 — Ethical Considerations**
- Data privacy and student information protection
- Fair assessment practices and AI bias awareness
- Academic integrity measures
- Consent and transparency in AI-assisted grading
- Equitable access considerations (internet, devices)

**Section 6 — Limitations**
- AI question generation accuracy caveats
- Internet dependency
- Browser compatibility constraints
- GES syllabus coverage scope
- Auto-grading limitations for subjective answers
- Scalability considerations

**Section 7 — Troubleshooting & FAQ**

### Technical Approach

- Use `docx` (npm) library to generate a professionally styled DOCX
- Navy/gold color scheme matching the existing PPTX proposal
- Proper heading styles, numbered lists, tables, and page breaks
- Output to `/mnt/documents/AI_Student_Diagnostic_User_Guide.docx`
- QA via LibreOffice PDF conversion and image inspection

