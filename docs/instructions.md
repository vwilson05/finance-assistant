## current_instructions: Financial Assistant - Development Cycle Guide

### 0.Pre-req: Clean up project structure and files to align to project goals.

The current project structure is a mix of newer Next.js practices in the frontend and potentially outdated backend/scripts structure. The Cursor agent will now refactor the project to streamline the codebase and align to modern best-practices.

#### Project Restructuring Steps:

1.  **Frontend Refactoring:**

    *   **Consolidate the landing page code:** All landing page code in `frontend/src/app/page.tsx` will be restructured into components. Remove unused code.
    *   **Move React Components:** Restructure React components within the `src/app` directory to follow best practices.

2.  **Backend Refactoring:**

    *   **Move main.py to app/main.py:** Align `main.py` in the backend to be located inside the `app` directory.

3.  **Combine Redundant Files:**
    *  **Merge or Refactor the Main entry point**: Combine the `backend/main.py` and `backend/app/main.py`. Ensure application is correctly running after that. 
    *  If there is any overlap with `honcho.yml` and `Procfile`, refactor to consolidate where possible.
    *   If `main.py` and any configuration files (`.env`) are providing identical functionality, refactor to eliminate duplication and improve clarity.

4. **Configuration Changes and Script Adjustments:**

    *   Update the `start.sh` script to reflect changes in project structure, such as moving `main.py`.
    *   Adjust paths within the `honcho.yml` configuration file to match the new file structure.

### 1. Project Overview and Current Goals
This project aims to create an AI-powered financial advisor application, replacing expensive financial advisory services with tailored investment strategies and dynamic financial plans.

*   **Objectives:**
    *   Develop personalized financial profiles.
    *   Generate customized, actionable financial plans.
    *   Provide on-demand, AI-driven advice through a conversational chatbot (future).
    *   Adapt plans dynamically based on market trends (future).

*   **Current Goals:**
    *   Establish a streamlined project structure to improve maintainability and scalability.
    *   Implement basic navigation and UI framework for key features (strategies, positions).
    *   Ensure proper database setup and connectivity.

### 2. Key Architectural Decisions

| Decision ID | Description                                                    | Date       | Rationale                                                                                                                                                         |
|-------------|----------------------------------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AD-001      | Use RESTful API for data operations                             | 2024-01-25 | Simplicity and standard integration across modules                                                                                                                |
| AD-002      | Modular separation of AI, UI, and Database layers               | 2024-01-25 | Easier maintenance and future extensibility                                                                                                                     |
| AD-003      | Integrate a chatbot advisor for interactive guidance              | 2024-01-25 | Enhances user engagement and provides on-demand advice                                                                                                       |
| AD-004      | Modern Next.js Architecture for frontend and FastAPI for Backend | 2024-01-25 | Next.js is used as project is a new React project. FastAPI for lightweight, testable and async backend.                                                                                           |

### 3. Challenges, Bugs, and Limitations

*   **Known Challenges:**
    *   Integrating AI functionality with financial data management.
    *   Ensuring real-time market data feeds are secure and accurate.
*   **Unresolved Bugs:**  None currently reported.
*   **Technical Limitations:**  
    *   Limited capacity for complex financial modeling or market simulation in the current architecture.

### 4. Priority Focus

*   **Immediate Attention:**
    *   Implement basic layout and UI components in the frontend.
    *   Complete database connectivity and migration setup in the backend.
    *   Establish authentication and authorization flow.
*   **Key Metrics:**
    *   Time to first meaningful render (frontend).
    *   Successful database connection rate (backend).
    *   End-to-end testing coverage for core features.

### 5. Update and Enhance Documentation in `/docs/`

#### 5.1. .agent.md
*   **Review & Update:**
    *   Review existing guidelines for Iterative Development, Context Preservation, Branching Strategy, etc.
    *   Ensure these guidelines are clear, actionable, and aligned with the project's current state.
    *   Update the "Processes" section to accurately reflect the current workflows for bug fixes and feature enhancements.
*   **Add Section:** Add sections about the tools, version control, development flow
#### 5.2. architecture.md
*   **Update Core Components:**
    *   Ensure the architecture diagram is up-to-date with any changes made during the restructuring phase.
    *   Reflect the current stack.

#### 5.3. database_schema.md
*   **Comprehensive Schema Review:**
    *   Review each table, field and relationship to align with refactored code.
    *   Ensure descriptions are detailed and accurate.
*   **Database Setup section:** Review and update database models to reflect any changes to the models to the backend or the migration process.

#### 5.4 database_setup.md
*   **Migration Process**: Review and update the migration process section
*   **Resetting the Database:**: Update the steps to reset the database, including any environment-specific instructions.

#### 5.5. features.md
*   **Comprehensive Review:**
    *   Confirm the completion status of the financial profiling feature and update the document to reflect the current implementation.
    *   Ensure that feature descriptions are detailed and align with the code.

#### 5.6. milestones.md
*   **Milestone 2 : Update MVP Development.**
    *   Make sure all information in the milestones are up to date and correct based on the changes to the code, files and architecture.

#### 5.7. project_overview.md
*   **Review:** Check if there were any changes to the Objectives or the Scope of the project and reflect this information in the document.

#### 5.8. ui_ux.md
*   **Consistent Theme:** Use clear design and minimalistic layout.

### 6. Identify and Repair Bugs
*The following bugs need to be found and repaired:*

*   **Database Connection Errors:** Implement proper error handling and reporting for any database connection-related issues. Ensure that error logs provide enough information for debugging.
*   **Migration Application Failures:** Add detailed logging to the migration scripts to track each step and catch errors, which can be written to standard error streams.

### 7. Enhance and Flesh Out Features
#### 7.1. Enhanced Financial Profiling:
*   **Task Breakdown:**
    *   **Add Employment Status Field:** Modify `FinancialProfile` model in `backend/app/models/financial_profile.py` to support free-form employment status.

*   **Dependencies and Constraints:**

    *   Dependency on `passlib` and `python-jose[cryptography]` for password hashing and JWT.
    *   Ensure proper security measures to protect against common attacks (e.g., brute force, SQL injection).
*  **Strategic Rationale**: Secure the backend api and enable only certain users to make certain changes to the data.