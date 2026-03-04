# Structured Questionnaire Answering Tool  

**GTM Engineering Internship Assignment**  

## Overview
A tool to automate structured questionnaire completion using reference documents.  
- Upload questionnaires & reference documents  
- AI-powered answers with citations  
- Review, edit, and export as PDF  

---

## Industry & Company
**Industry:** SaaS  
**Fictional Company:** TechNova Solutions – a SaaS startup providing secure cloud-based document management and workflow automation.  

---

## Technologies
- **Frontend:** HTML, CSS, JavaScript, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL (via Sequelize)  
- **AI/NLP:** OpenAI API  
- **File Handling & Export:** Multer, PDF generation  

---

## Features
- User sign-up & login  
- Questionnaire upload & parsing  
- Reference document upload  
- AI answer generation with citations  
- Review & edit answers  
- PDF export preserving structure  

---

## Setup
```bash
git clone <repo-url>
cd structured-questionnaire-tool
npm install
npx sequelize db:create
npx sequelize db:migrate
# configure .env with DB & API keys
npm start

Assumptions

Reference documents contain sufficient information for generating answers
Only supported formats (PDF, XLSX, TXT) are uploaded
AI model generates answers based on provided references only
Citations reference the document or section used

Trade-offs

Limited Parsing: Multi-page questionnaires handled in a simplified way
PDF Export Styling: Minimal formatting applied to preserve structure
AI Dependence: Answers rely solely on reference documents

Future Improvements

Deploy application for live access
Implement confidence scores per answer
Add version history for multiple runs
Include coverage summary for answered/unanswered questions
Improve AI reasoning across multiple reference documents
Enhance UI/UX for smoother experience

Author

Name: Yogita 
Email: yogita03.k@gmail.com