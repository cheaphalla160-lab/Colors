export type ColorId = 
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'black'
  | 'white'
  | 'grey';

export interface ColorItem {
  id: ColorId;
  nameEn: string;
  nameZh: string;
  phonetic: string;
  hex: string;
  borderHex: string;
  bgLightHex: string;
  textColorHex: string;
  
  // Singular pattern
  singular: {
    objectNameEn: string;
    objectNameZh: string;
    article: string; // "a" or "an"
    questionEn: string; // "What color is it?"
    questionZh: string; // "它是什么颜色？"
    answerEn: string; // "It's red."
    answerZh: string; // "它是红色的。"
    fullSentence: string; // "It is a red apple."
    iconType: string;
  };
  
  // Plural pattern
  plural: {
    objectNameEn: string;
    objectNameZh: string;
    questionEn: string; // "What colour are they?"
    questionZh: string; // "它们是什么颜色？"
    answerEn: string; // "They're red."
    answerZh: string; // "它们是红色的。"
    fullSentence: string; // "They are red apples."
    iconType: string;
    count: number;
  };

  funFactZh: string;
}

export type ActiveTab = 'cards' | 'bingo' | 'puzzle' | 'pk' | 'print';
