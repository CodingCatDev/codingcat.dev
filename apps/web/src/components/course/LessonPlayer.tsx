import { useMemo } from "react";

import { parseYoutubeVideoId, youtubeEmbedSrc } from "@/lib/youtube";

type SanityFileAsset = {
  url?: string | null;
  mimeType?: string | null;
};

type LessonRef = {
  _id: string;
  title: string;
  slug: string;
  locked?: boolean;
  coverImage?: unknown;
  /** Raw string from CMS: may be URL or 11-char id */
  youtube?: string | null;
  videoCloudinary?: { asset?: SanityFileAsset | null } | null;
};

type Section = {
  title?: string | null;
  lesson?: LessonRef[] | null;
};

type CourseNav = {
  title: string;
  slug: string;
  sections?: Section[] | null;
};

type LessonDoc = LessonRef & {
  title: string;
};

function flattenLessons(course: CourseNav): LessonRef[] {
  const out: LessonRef[] = [];
  for (const section of course.sections ?? []) {
    for (const l of section.lesson ?? []) {
      if (l?.slug) out.push(l);
    }
  }
  return out;
}

function IconHome() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    </svg>
  );
}

function IconChevLeft() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function IconChevRight() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

function LockBadge({ locked }: { locked?: boolean }) {
  if (!locked) return null;
  return (
    <span
      className="shrink-0 rounded border border-[--border] bg-[--surface] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[--text-tertiary]"
      title="Locked"
    >
      Pro
    </span>
  );
}

export default function LessonPlayer({
  lesson,
  course,
  courseSlug,
}: {
  lesson: LessonDoc;
  course: CourseNav;
  courseSlug: string;
}) {
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const index = lessons.findIndex((l) => l.slug === lesson.slug);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

  const base = `/course/${courseSlug}/lesson`;
  const youtubeId = parseYoutubeVideoId(lesson.youtube ?? undefined);

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(240px,280px)_1fr] lg:items-start lg:gap-8">
      <aside className="order-2 rounded-xl border border-[--border] bg-[--surface] lg:order-1 lg:max-h-[min(80vh,720px)] lg:overflow-y-auto">
        <div className="border-b border-[--border] p-4">
          <a
            href={`/course/${courseSlug}`}
            className="text-sm font-semibold text-[--text] hover:text-primary"
          >
            {course.title}
          </a>
        </div>
        <nav className="p-2 text-sm" aria-label="Lessons">
          {course.sections?.map((section, i) => (
            <div key={section.title ?? `section-${i}`} className="mb-4">
              {section.title && (
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-[--text-tertiary]">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-0.5">
                {section.lesson?.map((l) => {
                  const active = l.slug === lesson.slug;
                  return (
                    <li key={l._id}>
                      <a
                        href={`${base}/${l.slug}`}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2 py-2 transition-colors ${
                          active
                            ? "bg-[--surface-hover] text-[--text] font-medium"
                            : "text-[--text-secondary] hover:bg-[--surface-hover] hover:text-[--text]"
                        }`}
                      >
                        <span className="min-w-0 flex-1 truncate">{l.title}</span>
                        <LockBadge locked={l.locked} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="order-1 min-w-0 lg:order-2">
        <div className="flex flex-col overflow-hidden rounded-xl border border-[--border] bg-[--surface]">
          <header className="flex min-h-14 items-center gap-3 border-b border-[--border] px-4 py-3">
            <h1 className="flex-1 text-lg font-semibold text-[--text] md:text-xl">{lesson.title}</h1>
            <LockBadge locked={lesson.locked} />
          </header>

          {youtubeId ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={youtubeEmbedSrc(youtubeId)}
                className="h-full w-full"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          ) : lesson.videoCloudinary?.asset?.url ? (
            <div className="aspect-video w-full bg-black">
              <video
                className="h-full w-full"
                controls
                playsInline
                preload="metadata"
                title={lesson.title}
              >
                <source
                  src={lesson.videoCloudinary.asset.url}
                  type={lesson.videoCloudinary.asset.mimeType ?? undefined}
                />
              </video>
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-[--surface-hover] text-[--text-tertiary]">
              No video for this lesson
            </div>
          )}

          <footer className="grid grid-cols-3 border-t border-[--border] px-2 py-2 sm:px-4">
            <div className="flex justify-start">
              {prev ? (
                <a
                  href={`${base}/${prev.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[--text-secondary] hover:bg-[--surface-hover] hover:text-[--text]"
                >
                  <IconChevLeft />
                  <span className="hidden sm:inline">Previous</span>
                </a>
              ) : (
                <span />
              )}
            </div>
            <div className="flex justify-center">
              <a
                href={`/course/${courseSlug}`}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[--text-secondary] hover:bg-[--surface-hover] hover:text-[--text]"
                title="Course home"
              >
                <IconHome />
              </a>
            </div>
            <div className="flex justify-end">
              {next ? (
                <a
                  href={`${base}/${next.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[--text-secondary] hover:bg-[--surface-hover] hover:text-[--text]"
                >
                  <span className="hidden sm:inline">Next</span>
                  <IconChevRight />
                </a>
              ) : (
                <span />
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
