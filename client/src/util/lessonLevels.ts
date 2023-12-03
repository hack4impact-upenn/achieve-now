const getLessonStringFromLessonLevel = (num: number): string => {
  if (num <= 20) {
    return `Rising Readers Lesson ${num}`;
  }
  if (num <= 24) {
    return `Word Families Lesson WF${num - 20}`;
  }
  return `General Curriculum Lesson ${num}`;
};

// eslint-disable-next-line import/prefer-default-export
export { getLessonStringFromLessonLevel };
