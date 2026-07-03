"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import Shell from "@/components/Shell";
import styles from "./start.module.css";

const hormonalOptions = [
  "Pregnant",
  "Breastfeeding",
  "On birth control",
  "Thyroid condition",
  "None of these",
];

const skinGoalOptions = [
  "Clear acne",
  "Reduce pigmentation",
  "Manage melasma",
  "Recover from whitening cream damage",
  "Healthy aging",
  "Improve skin barrier",
  "General skin health",
];

const previousTreatmentOptions = [
  "Whitening creams",
  "Hydroquinone",
  "Steroid creams",
  "Chemical peels",
  "Laser treatments",
  "Oral medications",
];

const lifestyleFields = [
  { id: "waterIntake", label: "Daily water intake", options: ["Less than 1L", "1–2L", "2–3L", "More than 3L"] },
  { id: "sleepQuality", label: "Sleep quality", options: ["Poor", "Fair", "Good", "Excellent"] },
  { id: "stressLevel", label: "Stress level", options: ["Low", "Moderate", "High", "Very high"] },
  { id: "smoking", label: "Smoking", options: ["Never", "Occasionally", "Regularly"] },
  { id: "alcohol", label: "Alcohol", options: ["Never", "Occasionally", "Regularly"] },
  { id: "exerciseFrequency", label: "Exercise frequency", options: ["Rarely", "1–2x per week", "3–4x per week", "5+ times per week"] },
];

function useMultiSelect() {
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(option: string) {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }
  return { selected, toggle };
}

export default function ConsultationStartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hormonalFactors, setHormonalFactors] = useState<string[]>([]);
  const skinGoals = useMultiSelect();
  const previousTreatments = useMultiSelect();

  function toggleHormonalFactor(option: string) {
    setHormonalFactors((prev) => {
      if (option === "None of these") {
        return prev.includes("None of these") ? [] : ["None of these"];
      }
      const withoutNone = prev.filter((o) => o !== "None of these");
      return withoutNone.includes(option)
        ? withoutNone.filter((o) => o !== option)
        : [...withoutNone, option];
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());
    data.hormonalFactors = hormonalFactors.join(", ") || "None of these";
    data.skinGoals = skinGoals.selected.join(", ");
    data.previousTreatments = previousTreatments.selected.join(", ");

    try {
      const res = await fetch("/api/consultations/questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed");

      // ✅ redirect to next step
      router.push("/consultations/photos");

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badge}>Step 1 of 3</div>
          <h1 className={styles.h1}>Consultation Questionnaire</h1>
          <p className={styles.p}>
            Complete this form so your skin concerns can be reviewed properly.
            The more accurate your answers, the better the guidance.
          </p>
        </section>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h2 className={styles.h2}>Basic information</h2>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" type="text" placeholder="Your full name" />
              </div>

              <div className={styles.field}>
                <label htmlFor="ageRange">Age range</label>
                <select id="ageRange" name="ageRange" defaultValue="">
                  <option value="" disabled>Select age range</option>
                  <option>Under 18</option>
                  <option>18–24</option>
                  <option>25–34</option>
                  <option>35–44</option>
                  <option>45+</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.h2}>Skin profile</h2>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="skinType">Skin type</label>
                <select id="skinType" name="skinType" defaultValue="">
                  <option value="" disabled>Select skin type</option>
                  <option>Dry</option>
                  <option>Normal</option>
                  <option>Combination</option>
                  <option>Oily</option>
                  <option>Not sure</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="sensitivity">Sensitivity level</label>
                <select id="sensitivity" name="sensitivity" defaultValue="">
                  <option value="" disabled>Select sensitivity level</option>
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                  <option>Very reactive</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="mainConcern">Main skin concern</label>
              <select id="mainConcern" name="mainConcern" defaultValue="">
                <option value="" disabled>Select main concern</option>
                <option>Hyperpigmentation / dark spots</option>
                <option>Acne / breakouts</option>
                <option>Post-acne marks</option>
                <option>Ingrown hairs / shaving bumps</option>
                <option>Sensitivity / irritation</option>
                <option>Barrier damage</option>
                <option>Uneven skin tone</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="otherConcerns">Other concerns</label>
              <textarea
                id="otherConcerns"
                name="otherConcerns"
                rows={4}
                placeholder="Describe any other concerns, triggers, or patterns you notice."
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.h2}>Skin goals</h2>
            <p className={styles.fieldHint}>What would you like to achieve?</p>
            <div className={styles.checkGroup}>
              {skinGoalOptions.map((option) => (
                <label key={option} className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={skinGoals.selected.includes(option)}
                    onChange={() => skinGoals.toggle(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.h2}>Current routine</h2>

            <div className={styles.field}>
              <label htmlFor="amRoutine">AM routine</label>
              <textarea
                id="amRoutine"
                name="amRoutine"
                rows={4}
                placeholder="List the products you use in the morning."
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="pmRoutine">PM routine</label>
              <textarea
                id="pmRoutine"
                name="pmRoutine"
                rows={4}
                placeholder="List the products you use at night."
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="activeIngredients">Strong actives or treatments used recently</label>
              <textarea
                id="activeIngredients"
                name="activeIngredients"
                rows={4}
                placeholder="Examples: retinoids, exfoliating acids, hydroquinone, peels, bleaching products."
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.h2}>Skin &amp; health history</h2>

            <div className={styles.field}>
              <label htmlFor="whiteningUse">Have you used skin whitening or bleaching creams?</label>
              <select id="whiteningUse" name="whiteningUse" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Never</option>
                <option>Used in the past</option>
                <option>Currently using</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="whiteningDetails">If yes, which products and for how long?</label>
              <textarea
                id="whiteningDetails"
                name="whiteningDetails"
                rows={3}
                placeholder="Product names and approximate duration of use, if applicable."
              />
            </div>

            <div className={styles.field}>
              <label>Hormonal factors that may be relevant</label>
              <div className={styles.checkGroup}>
                {hormonalOptions.map((option) => (
                  <label key={option} className={styles.checkOption}>
                    <input
                      type="checkbox"
                      checked={hormonalFactors.includes(option)}
                      onChange={() => toggleHormonalFactor(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="sunExposure">Daily sun exposure</label>
              <select id="sunExposure" name="sunExposure" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Minimal (mostly indoors)</option>
                <option>Moderate (some outdoor time)</option>
                <option>High (extended daily outdoor exposure)</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.h2}>Previous treatments</h2>
            <p className={styles.fieldHint}>Have you previously used any of the following?</p>
            <div className={styles.checkGroup}>
              {previousTreatmentOptions.map((option) => (
                <label key={option} className={styles.checkOption}>
                  <input
                    type="checkbox"
                    checked={previousTreatments.selected.includes(option)}
                    onChange={() => previousTreatments.toggle(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.h2}>Lifestyle factors</h2>
            <div className={styles.grid2}>
              {lifestyleFields.map((field) => (
                <div className={styles.field} key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <select id={field.id} name={field.id} defaultValue="">
                    <option value="" disabled>Select one</option>
                    {field.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.h2}>History</h2>

            <div className={styles.field}>
              <label htmlFor="duration">How long have you had this concern?</label>
              <select id="duration" name="duration" defaultValue="">
                <option value="" disabled>Select duration</option>
                <option>Less than 1 month</option>
                <option>1–3 months</option>
                <option>3–6 months</option>
                <option>6–12 months</option>
                <option>More than 1 year</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="historyNotes">Additional notes</label>
              <textarea
                id="historyNotes"
                name="historyNotes"
                rows={4}
                placeholder="Tell us anything else about your skin concerns."
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primary} disabled={loading}>
  {loading ? "Saving..." : "Save and continue"}
</button>
            <button type="button" className={styles.secondary}>
              Save draft
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}