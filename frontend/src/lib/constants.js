import {
  Upload,
  Table,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const STEPS = [
  { id: "upload", label: "Upload CSV", icon: Upload },
  { id: "preview", label: "Preview Data", icon: Table },
  { id: "process", label: "AI Processing", icon: Sparkles },
  { id: "results", label: "Results", icon: CheckCircle2 },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB to match backend

export const SAMPLE_CSV = `created_at,name,email,country_code,mobile_without_country_code,company,city,state,country,lead_owner,crm_status,crm_note,data_source,possession_time,description
2026-05-13 14:20:48,John Doe,john.doe@example.com,+91,9876543210,GrowEasy,Mumbai,Maharashtra,India,test@gmail.com,GOOD_LEAD_FOLLOW_UP,Client is asking to reschedule demo,,,
2026-05-13 14:25:30,Sarah Johnson,sarah.johnson@example.com,+91,9876543211,Tech Solutions,Bangalore,Karnataka,India,test@gmail.com,DID_NOT_CONNECT,"Person was busy, will try again next week",,,
2026-05-13 14:30:15,Rajesh Patel,rajesh.patel@example.com,+91,9876543212,Startup Inc,Delhi,Delhi,India,test@gmail.com,BAD_LEAD,Not interested in our services,,,
2026-05-13 14:35:22,Priya Singh,priya.singh@example.com,+91,9876543213,Enterprise Corp,Pune,Maharashtra,India,test@gmail.com,SALE_DONE,"Deal closed, onboarding in progress",,,`;
