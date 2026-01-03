# Changes

This document describes the changes, improvements, and design decisions made during the implementation of the home assignment.

## Bugs

### Missing redirect after login
After a successful login, the user was not redirected to the Dashboard.
The issue was caused by the Login page and the Dashboard using different instances of useAuth.

Solution: Introduced a shared authentication state using useContext to ensure a single source of truth.

### Newly created or deleted tasks were not reflected in the UI
After adding a task, it did not appear in the task list until a full refresh.
The issue was caused by duplicated task state management.

Solution: Refactored the data flow so the TaskList component manages the tasks state, ensuring proper synchronization after create       
          operations.          

## Code improvements

### - Type Safety Improvements
- Reduced usage of `any` across the codebase.
- Introduced explicit TypeScript types for task status and task priority instead of generic strings.
- Improved typing for form state and filter state to prevent invalid values.
- Ensured safer state updates using functional updates where appropriate.
    Example:  setEditFormData(prevFormData => ({
                ...prevFormData,
                [field]: value,
              }));

### Error Handling
- Added consistent `try/catch` handling for all backend API calls.
- Logged errors explicitly to improve debuggability.

### Code Structure & Maintainability
- Replaced relative imports (`../../services/...`) with absolute path aliases (`@/services/...`) for better readability and      
  maintainability.

### Frontend Improvements – Rendering & State Management
- Identified unnecessary re-renders caused by handling loading state at the App level.
- Refactored loading logic to avoid coupling global routing with transient loading state.
- Improved render performance and routing stability by keeping App focused on authentication and route composition only.  

### Backend Improvements – Search & Filtering
- Replaced unsafe raw SQL queries ($queryRawUnsafe) with Prisma’s typed query API to prevent SQL injection.
- Improved query performance and maintainability by using structured findMany filters.
- Implemented case-insensitive full-text search across task titles and descriptions using Prisma contains.
- Validated and normalized query parameters before applying them to database queries.

### Backend Improvements – Middleware & Validation
- Added dedicated middleware for task CRUD operations to centralize input validation and request handling.
- Improved security and consistency by validating task payloads before create and update operations.

## Features

### New Feature: Advanced Filtering & Search (Option B)

#### Multi-Criteria Filtering
- Implemented filtering by task status and priority.
- Filters are combined using logical AND to ensure predictable and precise results.
- UI updates immediately when filters change.

#### Full-Text Search
- Implemented full-text search across **both task titles and task descriptions**.
- Search is case-insensitive and matches partial text.
- Text search logic uses OR semantics internally (title OR description), combined with AND semantics for other filters.

#### Performance Optimization
- Implemented client-side debouncing for the search input to avoid unnecessary backend requests on every keystroke.
- Status and priority filters remain immediate, while text search is debounced for better UX and performance.

#### URL-Based Filter State
- Filter state (status, priority, search query) is synchronized with URL query parameters.
- Enables sharing filtered views via URL.
- Filters are restored correctly when navigating directly to a URL containing query parameters.

#### Saved filter presets
- Implemented saved filter presets that allow users to store and reapply commonly used filter.

### Creative Feature: Dark Mode
- Implemented a global dark mode toggle for improved user experience.
- Dark mode is applied consistently across the application using Tailwind CSS utilities.
- UI components were adjusted to ensure sufficient contrast and readability in both light and dark modes.

## UX Improvements

### Delete Confirmation Modal
- Added a confirmation modal before deleting a task to prevent accidental data loss.
- The modal provides clear user feedback and explicit confirmation/cancellation actions.
- Improved overall usability and safety of destructive actions.

### Auto logout
- Implemented automatic logout behavior when authentication/session expires.
- Prevents users from remaining in an invalid or partially authenticated state.
- Improves security.

## Suggested Future Improvements
- Replace token storage in localStorage with HTTP-only cookies to further improve authentication security and reduce XSS risk.
- Implement infinite scrolling or pagination to improve performance and usability when the task list grows large.
- Improve error handling by displaying user-friendly error messages and retry options in the UI
- Token lifecycle: login/register keep tokens in localStorage with no 401 handling; 
  add a global response interceptor to refresh token.