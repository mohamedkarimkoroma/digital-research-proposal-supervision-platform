# Digital Research Proposal Supervision Platform

**A modern, web-based solution for streamlining the submission, review, and supervision of academic research proposals.**

## 📖 Project Overview
The **Digital Research Proposal Supervision Platform** is a comprehensive web application designed to digitize and automate the traditional, paper-based research proposal supervision process. This platform bridges the gap between students, supervisors, and university administrators by providing a centralized, transparent, and efficient environment for academic milestone tracking.

This project was developed as a final-year dissertation requirement for **Limkokwing University of Creative Technology**.

## 👥 Development Team
**Group Lead / Lead Developer:** Mohamed Karim Koroma
**Team Members:** 
- David Sesay
- Promise G Sandy

## ✨ Key Features

### For Students:
- **Proposal Submission:** Easy-to-use portal to submit research titles, abstracts, and upload PDF proposal documents.
- **Progress Tracking:** Real-time dashboard to track the status of submissions (Submitted, Under Review, Revision Required, Approved).
- **Revision Management:** Seamlessly upload revised documents based on supervisor feedback.

### For Supervisors / Lecturers:
- **Review Portal:** Dedicated dashboard to view assigned student proposals.
- **Feedback System:** Provide structured feedback and approve/reject proposals.
- **Milestone Tracking:** Monitor the academic progress of all assigned students.

### For Administrators:
- **System Oversight:** Full visibility over all users, proposals, and system activity.
- **User Management:** Approve and manage user accounts (Students, Supervisors, Admins).
- **Analytics Dashboard:** View statistics on total submissions and approval rates.

## 🔒 Security & Role-Based Access Control (RBAC)
To simulate a real-world university IT environment, this system uses strict **Role-Based Access Control**:
- Public registration defaults to the **Student** role.
- **Supervisors** and **Administrators** require internal authorization.
- *Note for Examination:* For the purpose of this academic demonstration, an "Account Type" selector is included on the registration page so the examination panel can test all three dashboards. In a production environment, this dropdown would be removed, and users would be assigned roles securely by the University IT Admin.

## 🛠️ Technology Stack
- **Frontend:** React.js, React Router, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & bcrypt
- **File Handling:** Multer (for PDF uploads)

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js installed on your machine
- MongoDB Atlas account (or local MongoDB)

### Step 1: Clone the Repository
```bash
git clone https://github.com/mohamedkarimkoroma/digital-research-proposal-supervision-platform.git
cd digital-research-proposal-supervision-platform