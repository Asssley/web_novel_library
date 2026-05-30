import { Lang } from '../../generated/enums.js';

export function mapNovelDetails(novel: any, lang: Lang) {
  const translation = novel.translations?.[0];

  return {
    ...novel,

    title: translation?.title ?? novel.title,

    description: translation?.description ?? novel.description,
  };
}