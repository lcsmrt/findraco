import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/input/base/InputGroup";
import { Eye, EyeClosed } from "lucide-react";
import { useState, type ComponentProps } from "react";

type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

/** A password input whose value the user can reveal; the toggle names its action for screen readers. */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputGroup className={className}>
      <InputGroupInput type={isVisible ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-sm"
          className="rounded-full"
          aria-label={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible((visible) => !visible)}
          disabled={props.disabled}
        >
          {isVisible ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
