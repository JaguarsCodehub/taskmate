# New TODOS:
- User Tasks Displayed for Admin ✅
- Reminder Cards just like a POST REQUSTS ✅
- Reports ON TIME / BEFORE / AFTER ✅
- Name of the APP, Details etc ✅
- Notification Docker Function (Supabase Docker)

1. While creating client, ask project
2. Update Tasks, Only title should be shown, With project and client ✅
3. Update Tasks, Filter (priority), color code for priority ✅
4. Mark as Complete needs Task Photo Proof ✅


# Task Management Mobile Application
 - *NOTIFICATION MASTER : 30 MIN / 2 HRS / 1 DAY / 2 DAY / 7 DAYS/ 15 DAYS / 30 DAYS 
    WHICH WILL BE ASKED WHEN ASSIGN TASK
 - *REMINDERS : FOR RENEWAL OF AMC / INSURANCE ETC 
    WHICH CAN BE MONTHLY / QTLY / HLY / YRLY 
    NEED NOTIFICATION BEFORE 30/15/7/1 DAY BEFORE
 - REPORTS : USERWISE TASK COMPLETED 
    ON TIME / BEFORE / AFTER ✅ (Need revision)
 - ReAssign Task needs revision

## New TODOS:
New Admin Features: 
 - 3 LEVEL REQUIRE
    - ADMIN ✅
    - MANAGER ✅
    - USER ✅
 - ALL TASK CAN BE VIEW BY ADMIN AND MANAGER ✅
 - Manager is provided with all the features as same as Admin ✅
   - Create Tasks, Assign Task, Create Projects, Clients ✅
   - Manager can also check Each User's Individial Report ✅

 - TIME ALSO REQUIRE FOR TASK ASSIGN (TIME SLOT) ✅
 - ONE TO MANY (ALL) TASK ASSIGN PROVISION ✅
 - PROJECT SELECTION IS OPTIONAL - NOT COMPULSORY FOR ASSIGN TASK ✅

New User Features:
 - USER CAN ALSO CREATE TASK FOR SOME REQUEST OR REQUIREMENT ✅

## TODOS:
- Admin:
    - Date Range Feature for User's Report ✅
    - A dropdown to fetch user's report by status ✅
    - Added Admin projects and clients adding Feature ✅
    - Delete Projects, Clients, Tasks as an Admin 
    - Color Indicator for priority tasks ✅
    - Password reset functionality
- User:
    - Tasks filtered based on status ✅
    - A Feature for Users to check their deadline tasks (A Date Referencing Feature) ✅
## Tasks Completed:

### Authentication
1. Authentication for Users and Admin with Id and Password ✅

### Users can:
1. Create a Task *(for themselves), Delete a Task, Read their Tasks. ✅
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
8. Get a Detailed Report on tasks. ✅
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
