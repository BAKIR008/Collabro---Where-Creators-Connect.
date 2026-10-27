/**
 * CollaBro — Auth Page Jokes
 * Category-specific humor for Login, Signup, and Forgot Password panels.
 *
 * Three pools: photographer | script-writer | client
 * Plus a 'general' pool shown before onboarding is complete.
 *
 * Each entry: { line: string (supports \n for line breaks), attr: string }
 */

/* ── Photographer jokes ──────────────────────────────────────────── */
export const PHOTOGRAPHER_JOKES = [
  {
    line: "Shot 847 photos today.\nKept 3.\nCalled it a productive session.",
    attr: "Every photographer, daily",
  },
  {
    line: "Client: 'Just one more shot.'\nSaid 17 times.\nIn a row.",
    attr: "The session that never ended",
  },
  {
    line: "My camera roll has two moods:\n'future portfolio masterpiece'\nand 'why did I take 47 shots\nof the same chair?'",
    attr: "Storage full, again",
  },
  {
    line: "Editing is almost done.\n(I've been saying this\nfor three weeks.)",
    attr: "The Lightroom spiral",
  },
  {
    line: "Golden hour lasts 20 minutes.\nSetting up my tripod\ntakes 25.",
    attr: "Nature, working against me",
  },
  {
    line: "Client: 'Can you fix the lighting?'\nMe: adjusts 43 sliders,\nlands back where I started.",
    attr: "Color grading, hour 4",
  },
  {
    line: "Running out of storage\nis just nature's way of saying\n'buy more lenses.'",
    attr: "Gear acquisition syndrome",
  },
  {
    line: "Portfolio perfectionism:\nthe art of shooting all day\nso you can upload nothing.",
    attr: "CollaBro Photography Truths",
  },
]

/* ── Script Writer jokes ─────────────────────────────────────────── */
export const SCRIPT_WRITER_JOKES = [
  {
    line: "I changed one sentence so many times\nit now has more character development\nthan the main character.",
    attr: "Draft 14, still going",
  },
  {
    line: "A script is never finished.\nOnly abandoned to a deadline.",
    attr: "Every writer, eventually",
  },
  {
    line: "Writer's block: when your cursor\nblinks faster than your ideas.",
    attr: "The blank page, mocking me",
  },
  {
    line: "Revised the first sentence\nfor six hours.\nThe rest of the script:\nuntouched since Tuesday.",
    attr: "Priorities unclear",
  },
  {
    line: "The character was supposed\nto have one scene.\nThey now have their own\nthree-episode arc.",
    attr: "My protagonist, escaping",
  },
  {
    line: "Deadline: noun.\nThe only known cure\nfor perfectionism.",
    attr: "CollaBro Dictionary",
  },
  {
    line: "script_FINAL.fdx\nscript_FINAL_v2.fdx\nscript_FINAL_ACTUAL_THIS_ONE.fdx\nscript_REAL_FINAL_USE_THIS.fdx",
    attr: "My desktop, currently",
  },
  {
    line: "My outline was one page.\nThe outline of the outline\nis now four.",
    attr: "Structure, loosely speaking",
  },
]

/* ── Client jokes ────────────────────────────────────────────────── */
export const CLIENT_JOKES = [
  {
    line: "My project brief was going\nto be two lines.\nIt now has chapters, footnotes,\nand a director's commentary.",
    attr: "The brief that grew up",
  },
  {
    line: "Client: 'Can you make it pop?'\nCreative: ......\nClient: 'You know. Just... pop.'",
    attr: "Creative direction, technically",
  },
  {
    line: "I know exactly what I want.\nI just need someone creative\nto figure out what that is.",
    attr: "The honest brief",
  },
  {
    line: "Deadline: next week.\nRealized: yesterday.",
    attr: "Calendar math is hard",
  },
  {
    line: "Reviewing draft #1:\n'Looks great, just\nchange everything.'",
    attr: "Feedback, constructive-ish",
  },
  {
    line: "Finding the right freelancer:\nlike casting a film\nfor a screenplay you haven't written.",
    attr: "CollaBro to the rescue",
  },
  {
    line: "'Make it more professional.\nBut also more fun.\nAnd simpler. But bold.'",
    attr: "The brief, unabridged",
  },
  {
    line: "I don't know the exact term\nbut I'll know it\nwhen I see it.",
    attr: "Discovery via iteration",
  },
]

/* ── General / pre-onboarding jokes ─────────────────────────────── */
export const GENERAL_JOKES = [
  {
    line: "Great creative work starts\nwith two people who can't\nagree on the font.",
    attr: "CollaBro Philosophy",
  },
  {
    line: "Deadlines: the original\ncollaboration tool.",
    attr: "History of creativity",
  },
  {
    line: "Good work takes time.\nGreat work takes\none more pass.",
    attr: "The eternal truth",
  },
  {
    line: "The first draft is just you\ntelling yourself the story.",
    attr: "Terry Pratchett",
  },
  {
    line: "Every creative project\nstarts with a vibe\nand ends with a deadline.",
    attr: "CollaBro, watching",
  },
  {
    line: "Somewhere between\n'this is terrible'\nand 'this is genius'\nlives every finished project.",
    attr: "The creative process, mapped",
  },
]

/**
 * Returns the correct joke pool based on account type and primary role.
 * Falls back to GENERAL_JOKES when role is unknown or onboarding is pending.
 *
 * @param {string|null} accountType  'client' | 'freelancer' | null
 * @param {string|null} primaryRole  'photographer' | 'script-writer' | null
 * @returns {Array<{line: string, attr: string}>}
 */
export function getJokesForRole(accountType, primaryRole) {
  if (accountType === 'client') return CLIENT_JOKES
  if (accountType === 'freelancer') {
    if (primaryRole === 'photographer') return PHOTOGRAPHER_JOKES
    if (primaryRole === 'script-writer') return SCRIPT_WRITER_JOKES
  }
  return GENERAL_JOKES
}
