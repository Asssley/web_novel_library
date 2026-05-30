export function mapListPage(novel: any, chaptersData: any) {
  const novelTranslation = novel.translations?.[0];

  return {
    novel: {
      id: novel.id,
      title: novelTranslation?.title ?? novel.title,
    },

    chapters: chaptersData.chapters.map((c: any) => {
      const translation = c.translations?.[0];

      return {
        id: c.id,
        chapterNumber: c.chapterNumber,
        title: translation?.title ?? c.title,
        updatedAt: c.updatedAt,
      };
    }),

    pagination: chaptersData.pagination,
  };
}