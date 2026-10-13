import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import FormInput from "./FormInput";

export default function PasswordInput({
  label,
  placeholder,
  helperText,
  id,
  name = "password",
  autoComplete = "current-password",
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <FormInput
      label={label}
      icon={Lock}
      id={id || name}
      name={name}
      autoComplete={autoComplete}
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      helperText={helperText}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="text-slate-400 dark:text-slate-500 transition-colors hover:text-amber-500 dark:hover:text-[#ffd159]"
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      }
      {...props}
    />
  );
}
