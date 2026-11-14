import { useCallback, useState } from "react";
import { profile, VCF_FILENAME, VCF_URL } from "../../data/profile";
import { CheckIcon, DownloadIcon, ShareIcon } from "./Icons";

/**
 * iOS Safari will not honour `download` on a cross-document navigation the way
 * desktop browsers do — it drops the file into Files instead of offering
 * "Add to Contacts". Navigating to a served text/vcard URL *does* open the
 * contact sheet, so iOS gets a plain navigation and everyone else gets the
 * anchor download (which keeps the page in place).
 */
function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as a Mac; touch points are the giveaway.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function saveContact() {
  if (isIOS()) {
    window.location.href = VCF_URL;
    return;
  }
  const a = document.createElement("a");
  a.href = VCF_URL;
  a.download = VCF_FILENAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

type Props = {
  onNotify?: (message: string) => void;
  className?: string;
  compact?: boolean;
};

export function SaveContactButton({ onNotify, className = "", compact = false }: Props) {
  const [saved, setSaved] = useState(false);

  const handle = useCallback(() => {
    saveContact();
    setSaved(true);
    onNotify?.("Contact card downloaded — open it to add Varun to your phone.");
    setTimeout(() => setSaved(false), 2600);
  }, [onNotify]);

  const size = compact ? 16 : 18;
  const idle = compact ? "Save contact" : "Save to contacts";
  const done = compact ? "Saved" : "Added to your downloads";

  return (
    <button type="button" onClick={handle} className={`btn btn-fill cd-save ${className}`}>
      {saved ? <CheckIcon size={size} /> : <DownloadIcon size={size} />}
      {saved ? done : idle}
    </button>
  );
}

export function ShareButton({ onNotify, className = "" }: Props) {
  const handle = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : profile.website;
    const data = {
      title: `${profile.fullName} — digital card`,
      text: `${profile.fullName}, ${profile.title}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      onNotify?.("Card link copied to clipboard.");
    } catch (err) {
      // AbortError = the user dismissed the share sheet; not worth a toast.
      if ((err as Error)?.name !== "AbortError") onNotify?.("Couldn't share — copy the link from the address bar.");
    }
  }, [onNotify]);

  return (
    <button type="button" onClick={handle} aria-label="Share this card" className={`cd-round ${className}`}>
      <ShareIcon size={19} />
    </button>
  );
}
