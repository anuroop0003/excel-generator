import { Link } from "react-router-dom";

export function AuthFooter() {
  return (
    <div className="text-sm text-center text-slate-500">
      Don't have an account?{" "}
      <Link to="/sign-up" className="text-[#107C41] font-bold hover:underline">
        Sign up
      </Link>
    </div>
  );
}
