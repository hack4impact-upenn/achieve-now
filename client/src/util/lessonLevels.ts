const getLessonStringFromLessonLevel = (num: number): string => {
  if (num <= 20) {
    return `Rising Readers`;
  }
  if (num <= 24) {
    return `Word Families`;
  }
  return `General Curriculum`;
};

// eslint-disable-next-line import/prefer-default-export
export { getLessonStringFromLessonLevel };
