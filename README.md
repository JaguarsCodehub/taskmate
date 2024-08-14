# Task Management Mobile Application

## TODOS:
- Report of a specific user based on dates
- Logs of a tasks done
- User Profile (Read, Update, Delete)
- Change Password (maybe)
- User Interface Turnaround

## Tasks Completed:

### Authentication
1. Authentication for Users and Admin with Id and Password ✅

### Users can:
1. Create a Task *(for themselves), Delete a Task, Read their Tasks. ✅⛔
2. Assigned Dashboard to check their assigned tasks. ✅
3. Users can check who has assigned the task, when and on what *project to which *client. ✅
4. Tasks will be filtered as per priority (low, medium, high) ✅
5. Users can mark their tasks as completed and that data will be stored in the database. ✅

### Admin can:
1. Create Tasks, Delete Tasks, Update Tasks ✅
2. Assign Tasks to specific users (employees) ✅
3. Assign Tasks based on priority levels (low, medium, high) ✅
4. Set Start and Due Date (deadline) for Each Task. ✅
5. Assign tasks based on Projects / Clients ✅
6. Initial Status should be “Pending” ✅
7. Reassign tasks to other users. ✅
8. Get a Detailed Report on tasks. 🚫
9. Create Projects , assign users to them. ✅
 

--------------------------------------------------------------------------
# Architecture and Features

## Master Tables
1. **User Master**
2. **Task Master**
3. **Assign Regular Task Master**
4. **Assign Special Task Master**
5. **Project Master (Sites)**
6. **Client Master (Customer)**
7. **Status Master**

## Functionalities and Features

### Authentication
1. Authentication for Users and Admin with ID and Password.
2. Password reset functionality.
3. User Personal Profiles (Image, Name, ID).

### Tasks Management

**Users Can:**
- Create a Task *(for themselves)*, Delete a Task, Read their Tasks.
- Access a Dashboard to check their personal tasks.
- Access an Assigned Dashboard to check their assigned tasks.
- View who assigned the task, when it was assigned, and the associated *project* and *client*.
- Filter tasks by priority (low, medium, high).
- Mark tasks as completed, with the completion status stored in the database.

**Admin Can:**
1. Create, Delete, and Update Tasks.
2. Assign Tasks to specific users (employees).
3. Assign Tasks based on priority levels (low, medium, high).
4. Set Start and Due Dates (deadlines) for each task.
5. Assign tasks based on Projects / Clients.
6. Set the initial status of tasks to “Pending.”
7. Reassign tasks to other users.
8. Generate detailed reports on tasks.
9. Create Projects and assign users to them.

### Report of Users Task Completed Data (Admin Only)
1. Generate a report of a specific user based on dates.
2. Track logs of days taken on a project.

## Future Use Case Features
1. Scheduling and Calendar Integration.
2. HR Management Feature.
3. Communication and Collaboration (Chatting).
4. User Activity Report.
