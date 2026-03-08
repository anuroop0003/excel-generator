import { Link } from "react-router-dom";

export function AuthFooter() {
  return (
    <div className="text-sm text-center text-slate-500">
      Already have an account?{" "}
      <Link to="/sign-in" className="text-[#107C41] font-bold hover:underline">
        Sign in
      </Link>
    </div>
  );
}
