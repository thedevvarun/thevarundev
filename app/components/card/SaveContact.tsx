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
    const t = setTimeout(() => setSaved(false), 2600);
    return () => clearTimeout(t);
  }, [onNotify]);

  return (
    <button
      type="button"
      onClick={handle}
      className={`vc-save group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 font-medium text-[#0b0b0f] transition-transform duration-300 active:scale-[0.98] ${
        compact ? "h-11 text-[13px]" : "h-14 text-[15px]"
      } ${className}`}
    >
      <span className="vc-save-sheen" aria-hidden />
      <span className="relative flex items-center gap-2.5">
        {saved ? <CheckIcon size={compact ? 16 : 18} /> : <DownloadIcon size={compact ? 16 : 18} />}
        {saved ? "Added to your downloads" : "Save to contacts"}
      </span>
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
    <button
      type="button"
      onClick={handle}
      aria-label="Share this card"
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white active:scale-[0.96] ${className}`}
    >
      <ShareIcon size={19} />
    </button>
  );
}
