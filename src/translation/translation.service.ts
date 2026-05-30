import { Injectable } from '@nestjs/common';
import * as deepl from 'deepl-node';

@Injectable()
export class TranslationService {
  private translator: deepl.Translator;


  constructor() {
    this.translator = new deepl.Translator(
      process.env.DEEPL_API_KEY!,
    );
  }

  async translate(text: string, language: string) {
    const deeplLangMap = {
      UKRAINIAN: 'UK',
      ENGLISH: 'EN-US',
    } as const;

    const targetLang = deeplLangMap[language];

    const result = await this.translator.translateText(
      text,
      null,
      targetLang,
    );

    return result.text;
  }
}