import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import FormInput from "./FormInput";

export default function PasswordInput({ label, placeholder, helperText, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormInput
      label={label}
      icon={Lock}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      helperText={helperText}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-slate-400 dark:text-gray-500 transition-colors hover:text-violet-300"
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      }
      {...props}
    />
  );
}
