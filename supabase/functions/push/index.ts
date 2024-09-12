// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Hello from Functions!")

// const supabase = createClient(
//   Deno.env.EXPO_PUBLIC_SUPABASE_URL || "",
//   Deno.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
// )


// Deno.serve(async (req) => {
//   try {
//     const now = new Date().toISOString()

//     // Fetch tasks where the notification time is due and not yet notified
//     const { data: tasks, error: tasksError } = await supabase
//       .from('task_assignments')
//       .select('task_id, assigned_to, notification_time')
//       .lte('notification_time', now)  // Find tasks where the notification time has passed
//       .is('notified', false)          // Assuming there's a notified boolean field

//     if (tasksError) {
//       return new Response(`Error fetching tasks: ${tasksError.message}`, { status: 500 })
//     }

//     for (const task of tasks) {
//       const { assigned_to } = task

//       // Fetch the user's push token
//       const { data: user, error: userError } = await supabase
//         .from('users')
//         .select('push_token')
//         .eq('id', assigned_to)
//         .single()

//       if (userError) {
//         console.error(`Error fetching user: ${userError.message}`)
//         continue
//       }

//       const pushToken = user.push_token

//       if (!pushToken) {
//         console.error(`No push token found for user ${assigned_to}`)
//         continue
//       }

//       // Send the push notification using Expo
//       const message = {
//         to: pushToken,
//         sound: 'default',
//         title: 'Task Reminder',
//         body: `You have a task coming up! Task ID: ${task.task_id}`,
//       }

//       const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(message),
//       })

//       const result = await expoRes.json()

//       if (expoRes.status === 200) {
//         console.log(`Push notification sent to user ${assigned_to}`)
        
//         // Mark the task as notified
//         await supabase
//           .from('task_assignments')
//           .update({ notified: true })
//           .eq('task_id', task.task_id)
//       } else {
//         console.error(`Failed to send push notification: ${result}`)
//       }
//     }

//     return new Response(JSON.stringify({ success: true }), { status: 200 })
//   } catch (error) {
//     console.error('Error sending notifications:', error)
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 })
//   }
// })

Deno.serve(async (req) => {
  const expoPushToken = "ExponentPushToken[8wcJl-INN9blzxP4JzbQwy]"
  

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      title: "Hello from Functions!",
      body: "Hello from Functions!",
    }),
  }).then((res) => res.json());



  return new Response(
    JSON.stringify(res),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/push' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
