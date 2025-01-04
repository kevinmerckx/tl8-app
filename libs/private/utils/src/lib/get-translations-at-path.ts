import { ModifiedTranslations } from '@tl8/private/interfaces';
import { getValueAtPath } from './get-value-at-path';
import { uniqueStrings } from './unique';

export function getTranslationsAtPath(
  modifiedTranslations: ModifiedTranslations,
  selectedPath = ''
): string[] {
  const recursiveAux = (translations: any, path: string): string[] => {
    if (typeof translations === 'string') {
      return [path];
    }
    if (!translations) {
      return [];
    }
    if (typeof translations !== 'object') {
      return [path];
    }
    return uniqueStrings(
      Array.from(Object.entries(translations)).reduce(
        (prev, [key, deeper]) => [
          ...prev,
          ...recursiveAux(deeper, path ? path + '.' + key : key),
        ],
        [] as string[]
      )
    );
  };
  return uniqueStrings(
    modifiedTranslations.reduce(
      (prev, { translations }) => [
        ...prev,
        ...recursiveAux(
          selectedPath
            ? getValueAtPath(translations, selectedPath.split('.'))
            : translations,
          selectedPath
        ),
      ],
      [] as string[]
    )
  );
}
