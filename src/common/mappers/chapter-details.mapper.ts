export function mapChapterPage(data: {
  chapter: any;
  prevChapterId: string | null;
  nextChapterId: string | null;
}) {
  const chapterTranslation = data.chapter.translations?.[0];
  const novelTranslation = data.chapter.novel.translations?.[0];

  return {
    chapter: {
      id: data.chapter.id,
      chapterNumber: data.chapter.chapterNumber,

      title: chapterTranslation?.title ?? data.chapter.title,
      text: chapterTranslation?.text ?? data.chapter.text,

      novel: {
        id: data.chapter.novel.id,
        title: novelTranslation?.title ?? data.chapter.novel.title,
      },
    },

    prevChapterId: data.prevChapterId,
    nextChapterId: data.nextChapterId,
  };
}