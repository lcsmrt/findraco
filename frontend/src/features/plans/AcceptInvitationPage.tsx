import {
  useAcceptInvitation,
  useGetInvitationPreview,
} from "@/api/services/useInvitationService";
import { PATHS } from "@/app/routing/paths";
import { useNavigate, useParams } from "react-router-dom";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { AcceptInvitationView } from "./AcceptInvitationView";

export function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setActivePlanId } = usePlanContext();

  const {
    data: preview,
    isLoading,
    isError,
  } = useGetInvitationPreview(token);

  const { mutate: acceptInvitation, isPending } = useAcceptInvitation({
    onSuccess: (result) => {
      setActivePlanId(result.planId);
      navigate(PATHS.home);
    },
  });

  function handleAccept() {
    if (token) acceptInvitation(token);
  }

  return (
    <AcceptInvitationView
      preview={preview}
      isLoading={isLoading}
      isError={isError}
      isAccepting={isPending}
      onAccept={handleAccept}
      onGoHome={() => navigate(PATHS.home)}
    />
  );
}
