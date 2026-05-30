export function mapNovelList(novels: any[]) {
  return novels.map((novel) => {
    const translation = novel.translations?.[0];

    return {
      id: novel.id,
      imagePath: novel.imagePath,

      title: translation?.title ?? novel.title,
    };
  });
}