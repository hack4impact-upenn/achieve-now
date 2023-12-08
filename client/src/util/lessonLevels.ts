const getLessonStringFromLessonLevel = (num: number): string => {
  if (num <= 20) {
    return `Rising Readers ${num}`;
  }
  if (num <= 24) {
    return `Word Families WF${num - 20}`;
  }
  return `General Curriculum ${num - 24}`;
};

// eslint-disable-next-line import/prefer-default-export
export { getLessonStringFromLessonLevel };
