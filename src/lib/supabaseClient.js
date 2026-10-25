import { createClient } from "@supabase/supabase-js";

// Read from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("placeholder")
);

// Fallback dummy client if credentials are not yet entered by user
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * High-level helper methods for Auth, CMS Content, and Media Management
 */

export async function loginUser(email, password) {
  if (!isSupabaseConfigured) {
    // Demo fallback for local development / testing
    if (email.toLowerCase().includes("admin") || email === "malavika@malavikasunil.com") {
      return {
        user: { id: "demo-admin-id", email, role: "admin", user_metadata: { full_name: "Dr. Malavika M. Sunil", role: "admin" } },
        role: "admin",
        error: null
      };
    }
    return {
      user: { id: "demo-student-id", email, role: "student", user_metadata: { full_name: "Demo Student", batch_name: "Bharatanatyam Diploma (Junior)", role: "student" } },
      role: "student",
      error: null
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { user: null, role: null, error };

  // Fetch profile role from 'profiles' table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, batch_name")
    .eq("id", data.user.id)
    .single();

  const role = profile?.role || data.user?.user_metadata?.role || "student";
  return { user: data.user, profile, role, error: null };
}

export async function signUpStudent(email, password, fullName, batchName) {
  if (!isSupabaseConfigured) {
    return {
      user: { id: "demo-new-student", email, user_metadata: { full_name: fullName, batch_name: batchName, role: "student" } },
      error: null
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        batch_name: batchName,
        role: "student"
      }
    }
  });

  return { user: data?.user, error };
}

export async function logoutUser() {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Media Storage Uploader
 * Uploads images or videos to a Supabase bucket and returns the public CDN URL
 */
export async function uploadMediaToBucket(bucketName, file, folder = "uploads") {
  if (!isSupabaseConfigured || !supabase) {
    // Return base64 or object URL fallback
    return {
      url: URL.createObjectURL(file),
      path: `${folder}/${file.name}`,
      error: null
    };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) return { url: null, error };

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return { url: publicUrlData.publicUrl, path: filePath, error: null };
}
