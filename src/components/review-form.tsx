"use client";

import { useRef, useState } from "react";
import { Star, X, Check, ArrowLeft, Play } from "lucide-react";

/**
 * Popup « Écrire un avis » — reproduit fidèlement le parcours Loox en 4 étapes :
 *   1. Note en étoiles (« Comment décririez-vous cet article ? »)
 *   2. Photos / vidéo (« Montrez-Le »)
 *   3. Texte de l'avis (« Nous en dire plus ! »)
 *   4. Coordonnées (« à propos de vous »)
 * L'avis est envoyé à /api/reviews en statut « pending » (modération) avant publication.
 */

const STEPS = 4;

const COPY = {
  fr: {
    ratingLabels: ["", "Je déteste", "Bof", "Correct", "J'aime bien", "J'adore !"],
    writeReview: "Écrire un avis",
    close: "Fermer",
    thanksTitle: "Merci pour votre avis !",
    thanksText: "Votre avis a bien été reçu. Il sera publié après validation par notre équipe.",
    step1Title: "Comment décririez-vous cet article ?",
    hate: "Je déteste",
    love: "J'adore !",
    step2Title: "Montrez-Le",
    step2Sub: "Nous serions ravis de le voir !",
    offer15: "Obtenez 15% offerts sur votre prochain achat",
    photoAdded: "Photo ajoutée ✓",
    addPhotos: "Ajouter des photos",
    offer20: "Obtenez 20% offerts sur votre prochain achat",
    videoAdded: "Vidéo ajoutée ✓",
    addVideo: "Ajouter une vidéo",
    step3Title: "Nous en dire plus !",
    textPlaceholder: "Partagez votre expérience avec ce produit…",
    step4Title: "à propos de vous",
    firstName: "Prénom",
    lastName: "Nom de famille",
    email: "Email",
    consent: "Par la présente, j'accepte les Conditions générales d'utilisation et la Politique de Confidentialité ainsi que l'affichage et le partage en ligne de mon avis.",
    back: "Retour",
    next: "Suivant",
    skip: "Passer",
    sending: "Envoi…",
    submit: "C'est fait",
    star: (n: number) => `${n} étoile${n > 1 ? "s" : ""}`,
  },
  en: {
    ratingLabels: ["", "I hate it", "Meh", "It's okay", "I like it", "I love it!"],
    writeReview: "Write a review",
    close: "Close",
    thanksTitle: "Thank you for your review!",
    thanksText: "Your review has been received. It will be published once approved by our team.",
    step1Title: "How would you describe this item?",
    hate: "I hate it",
    love: "I love it!",
    step2Title: "Show it off",
    step2Sub: "We'd love to see it!",
    offer15: "Get 15% off your next purchase",
    photoAdded: "Photo added ✓",
    addPhotos: "Add photos",
    offer20: "Get 20% off your next purchase",
    videoAdded: "Video added ✓",
    addVideo: "Add a video",
    step3Title: "Tell us more!",
    textPlaceholder: "Share your experience with this product…",
    step4Title: "about you",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    consent: "I hereby accept the Terms of Use and the Privacy Policy, as well as the online display and sharing of my review.",
    back: "Back",
    next: "Next",
    skip: "Skip",
    sending: "Sending…",
    submit: "Done",
    star: (n: number) => `${n} star${n > 1 ? "s" : ""}`,
  },
} as const;

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-4.5-4.5L5 22" />
    </svg>
  );
}

export default function ReviewForm({
  productHandle,
  productTitle,
  lang = "fr",
}: {
  productHandle: string;
  productTitle: string;
  lang?: string;
}) {
  const t = COPY[lang === "en" ? "en" : "fr"];
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 note · 1 média · 2 texte · 3 coordonnées
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  function reset() {
    setStep(0); setRating(0); setHover(0); setText("");
    setFirstName(""); setLastName(""); setEmail("");
    setPhoto(null); setVideo(null); setStatus("idle");
  }
  function close() {
    setOpen(false);
    window.setTimeout(reset, 220);
  }

  function pickRating(n: number) {
    setRating(n);
    window.setTimeout(() => setStep(1), 150); // passe à l'étape suivante après la sélection
  }

  async function submit() {
    if (status === "sending") return;
    if (rating === 0 || !firstName.trim() || !email.trim()) return;
    setStatus("sending");
    const fd = new FormData();
    fd.append("productHandle", productHandle);
    fd.append("productTitle", productTitle);
    fd.append("rating", String(rating));
    fd.append("name", `${firstName.trim()} ${lastName.trim()}`.trim());
    fd.append("email", email);
    fd.append("text", text);
    if (photo) fd.append("photo", photo);
    if (video) fd.append("video", video);
    try {
      await fetch("/api/reviews", { method: "POST", body: fd });
    } catch {
      /* best-effort : on confirme quand même côté UX */
    }
    setStatus("done");
  }

  const shown = hover || rating;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full ring-1 ring-bien-forest/25 text-black px-5 py-2.5 text-sm font-semibold hover:bg-bien-forest hover:text-bien-cream transition-colors"
      >
        {t.writeReview}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={t.writeReview}>
          <button aria-label={t.close} onClick={close} className="absolute inset-0 bg-bien-forest/45 backdrop-blur-sm" />

          <div className="relative w-full max-w-xl rounded-[1.75rem] bg-white ring-1 ring-border bien-shadow flex flex-col min-h-[30rem] max-h-[92vh] animate-[bien-fade-up_0.3s_ease] overflow-hidden">
            {/* Fermer */}
            <button onClick={close} aria-label={t.close} className="absolute top-4 left-4 grid place-items-center h-8 w-8 rounded-full text-black/70 hover:bg-bien-cream transition-colors z-10">
              <X className="h-5 w-5" />
            </button>

            {status === "done" ? (
              <div className="flex-1 grid place-items-center text-center px-8 py-12">
                <div>
                  <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-bien-leaf text-bien-cream"><Check className="h-8 w-8" /></span>
                  <h2 className="mt-5 font-display font-black tracking-tight text-2xl text-black">{t.thanksTitle}</h2>
                  <p className="mt-2 text-sm text-black/65 leading-relaxed max-w-xs mx-auto">
                    {t.thanksText}
                  </p>
                  <button onClick={close} className="mt-7 inline-flex items-center gap-2 rounded-full bg-bien-forest text-bien-cream px-7 py-3 text-sm font-semibold hover:bg-bien-leaf transition-colors">
                    {t.close}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Corps de l'étape */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-10 pt-16 pb-6 flex flex-col justify-center">
                  {/* Étape 1 — Note */}
                  {step === 0 && (
                    <div className="text-center">
                      <h2 className="font-display font-black tracking-tight text-2xl sm:text-3xl text-black">{t.step1Title}</h2>
                      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4" onMouseLeave={() => setHover(0)}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => pickRating(n)}
                            onMouseEnter={() => setHover(n)}
                            aria-label={t.star(n)}
                          >
                            <Star className={`h-11 w-11 sm:h-12 sm:w-12 transition-colors ${n <= shown ? "fill-bien-gold text-bien-gold" : "fill-transparent text-black/25"}`} />
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between px-1 text-sm">
                        <span className="text-black/55">{t.hate}</span>
                        <span className="font-semibold text-black">{shown ? t.ratingLabels[shown] : ""}</span>
                        <span className="text-black/55">{t.love}</span>
                      </div>
                    </div>
                  )}

                  {/* Étape 2 — Média */}
                  {step === 1 && (
                    <div className="text-center">
                      <h2 className="font-display font-black tracking-tight text-2xl sm:text-3xl text-black">{t.step2Title}</h2>
                      <p className="mt-1.5 text-black/60">{t.step2Sub}</p>

                      <div className="mt-7 rounded-2xl ring-1 ring-border p-4">
                        <p className="font-display font-black text-lg text-black">{t.offer15}</p>
                        <button
                          type="button"
                          onClick={() => photoInput.current?.click()}
                          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-bien-forest text-bien-cream px-5 py-3.5 text-sm font-semibold hover:bg-bien-leaf transition-colors"
                        >
                          <ImageIcon className="h-5 w-5" /> {photo ? t.photoAdded : t.addPhotos}
                        </button>
                        <input ref={photoInput} type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                      </div>

                      <div className="mt-4 rounded-2xl ring-1 ring-border p-4">
                        <p className="font-display font-black text-lg text-black">{t.offer20}</p>
                        <button
                          type="button"
                          onClick={() => videoInput.current?.click()}
                          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-bien-forest text-bien-cream px-5 py-3.5 text-sm font-semibold hover:bg-bien-leaf transition-colors"
                        >
                          <Play className="h-5 w-5" /> {video ? t.videoAdded : t.addVideo}
                        </button>
                        <input ref={videoInput} type="file" accept="video/*" className="hidden" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
                      </div>
                    </div>
                  )}

                  {/* Étape 3 — Texte */}
                  {step === 2 && (
                    <div className="text-center">
                      <h2 className="font-display font-black tracking-tight text-2xl sm:text-3xl text-black">{t.step3Title}</h2>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={6}
                        autoFocus
                        placeholder={t.textPlaceholder}
                        className="mt-6 w-full rounded-2xl bg-white ring-1 ring-border px-4 py-3.5 text-[15px] text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-bien-gold transition resize-none text-left"
                      />
                    </div>
                  )}

                  {/* Étape 4 — Coordonnées */}
                  {step === 3 && (
                    <div className="text-center">
                      <h2 className="font-display font-black tracking-tight text-2xl sm:text-3xl text-black">{t.step4Title}</h2>
                      <div className="mt-7 grid sm:grid-cols-2 gap-4 text-left">
                        <label className="block">
                          <span className="text-sm font-semibold text-black">{t.firstName} <span className="text-red-500">*</span></span>
                          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1.5 w-full rounded-xl bg-white ring-1 ring-border px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-bien-gold transition" />
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-black">{t.lastName} <span className="text-red-500">*</span></span>
                          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1.5 w-full rounded-xl bg-white ring-1 ring-border px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-bien-gold transition" />
                        </label>
                      </div>
                      <label className="block text-left mt-4">
                        <span className="text-sm font-semibold text-black">{t.email} <span className="text-red-500">*</span></span>
                        <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl bg-white ring-1 ring-border px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-bien-gold transition" />
                      </label>
                      <p className="mt-5 text-xs text-black/55 leading-relaxed">
                        {t.consent}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pied : navigation + barre de progression (masqué à l'étape note) */}
                {step > 0 && (
                  <div className="border-t border-border px-6 sm:px-8 py-4 flex items-center gap-4">
                    <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-black hover:text-bien-leaf transition-colors">
                      <ArrowLeft className="h-4 w-4" /> {t.back}
                    </button>

                    <div className="flex-1 flex items-center justify-center gap-1.5">
                      {Array.from({ length: STEPS }).map((_, i) => (
                        <span key={i} className={`h-1.5 w-10 rounded-full transition-colors ${i <= step ? "bg-black" : "bg-black/15"}`} />
                      ))}
                    </div>

                    {step === 1 && (
                      <button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-black hover:text-bien-leaf transition-colors">
                        {photo || video ? t.next : t.skip}
                      </button>
                    )}
                    {step === 2 && (
                      <button type="button" onClick={() => setStep(3)} disabled={!text.trim()} className="rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-bien-forest transition-colors disabled:opacity-40">
                        {t.next}
                      </button>
                    )}
                    {step === 3 && (
                      <button type="button" onClick={submit} disabled={!firstName.trim() || !email.trim() || status === "sending"} className="rounded-full bg-black text-white px-6 py-2.5 text-sm font-semibold hover:bg-bien-forest transition-colors disabled:opacity-40">
                        {status === "sending" ? t.sending : t.submit}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
