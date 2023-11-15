/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { PaginationTable, TColumn } from '../PaginationTable';
import { useData } from '../../util/api';
import { useAppSelector } from '../../util/redux/hooks';
import { selectUser } from '../../util/redux/userSlice';
import IStudent from '../../util/types/student';
import IUser from '../../util/types/user';
import ILesson from '../../util/types/lesson';
// import { Button } from '@mui/material';

type PhoneticsTableProps = {
  teacherID: string;
};

interface PhoneticsTableRow {
  key: string;
  phonetic_pattern: string;
  students: string;
}

/**
 * The standalone table component for holding information about the users in
 * the database and allowing admins to remove users and promote users to admins.
 */
function PhoneticsTable({ teacherID }: PhoneticsTableProps) {
  // phonetics
  const phonicPatterns = [
    'D',
    'G',
    'L',
    'H',
    'R',
    'N',
    'B',
    'C',
    'F',
    'M',
    'T',
    'P',
    'V',
    'K',
    'J',
    'W',
    'X',
    'Q',
    'Y',
    'Z',
    'at & ad',
    'ag & ap',
    'at & it',
    'ap & ip',
    'at; an; ad; ap',
    'am; ag; ab; ax',
    'ig; ip; it; in',
    'ill; id; im; is/iss',
    'ug; ut; un; um',
    'ud; up; us',
    'eg; ed; et; en',
    'ot; ob; og; op',
    'ck',
    'gl; bl; sl; pl; fl; cl',
    'pr; gr; tr; br',
    'fr; dr; cr',
    'sn; sw; sm; sc',
    'sp; st; sk',
    'nk; nd; nt; ng',
    'lt; mp; ft',
    'sh; th; wh',
    'ch; tch',
    'dge',
    'a_e vs. aa',
    'i_e vs. i',
    'o_e vs. o; u_e vs. u',
    'Soft sounds of c and g',
    'ar; or',
    'ir; ur; er',
    'w+or; w+ar',
    'ai; ay',
    '',
    'oa; ow; oe',
    'ee; ea',
    'ey; ie',
    'igh; ie',
    'vowel sounds of y',
    'ou; ow',
    'aw; au',
    'oy; oi',
    'oo',
    'sounds of long u',
    'kn; wr; gn; mb',
  ];
  const exampleWords = [
    'Sound of D',
    'Sound of G',
    'Sound of L',
    'Sound of H',
    'Sound of R',
    'Sound of N',
    'Sound of B',
    'Sound of C',
    'Sound of F',
    'Sound of M',
    'Sound of T',
    'Sound of P',
    'Sound of V',
    'Sound of K',
    'Sound of J',
    'Sound of W',
    'Sound of X',
    'Sound of Q',
    'Sound of Y',
    'Sound of Z',
    'hat; had',
    'sag; sap',
    'pat; pit',
    'lap; lip',
    'cat; fan; mad; sap',
    'ham; sag; lab; fax',
    'big; dip; pit; win',
    'Jill; lid; him; miss',
    'bug; nut; fun; yum',
    'mud; pup; Gus',
    'leg; bed; pet; hen',
    'not; job; dog; hop',
    'duck; rock; pick’ back',
    'glad; block; sled; plus; flip; clot',
    'pram; grass; tree; brick',
    'frog; drum; crab',
    'snap; swim; smile; scale',
    'spin; stop; desk; skate',
    'pink; sand; tent; king',
    'belt; jump; raft',
    'shell; thin; whip',
    'chin; hatch',
    'edge; bridge',
    'tape vs. tap; cape vs. cap',
    'kite vs. kit; pine vs. pin',
    'code vs. cod; cube vs. cub; here vs. her',
    'city; ice; cage; gem',
    'scarf; fork',
    'bird; purse; fern',
    'word; warm',
    'rain; gray',
    '',
    'coat; snow; toe',
    'teeth; seal',
    'donkey; field',
    'night; pie',
    'fly; baby; myth',
    'cloud; plow',
    'draw; sauce',
    'boy; coin',
    'book; moon',
    'cube; tube',
    'knee; sign; write; bomb',
  ];

  const levels = [];

  for (let i = 0; i < phonicPatterns.length; i += 1) {
    levels.push([phonicPatterns[i], exampleWords[i]]);
  }

  // define columns for the table
  const columns: TColumn[] = [
    { id: 'phonetic_pattern', label: 'Phonetic Pattern' },
    { id: 'students', label: 'Students' },
  ];

  const [userList, setUserList] = useState<IUser[]>([]);
  const users = useData('admin/all');
  const self = useAppSelector(selectUser);

  const [studentList, setStudentList] = useState<IStudent[]>([]);

  const [rows, setRows] = useState<PhoneticsTableRow[]>([]);

  const [lessonList, setLessonList] = useState<ILesson[]>([]);
  const lessons = useData('lesson/all');

  // list of all students with the teacher_id
  const students = useData(`student/teacher/${teacherID}`);

  useEffect(() => {
    if (users) {
      const userData = users.data ?? [];
      setUserList(userData);
    }
    if (students) {
      const studentData = students.data ?? [];
      setStudentList(studentData);
    }
    if (lessons) {
      const lessonData = lessons.data ?? [];
      setLessonList(lessonData);
    }
  }, [users, students, lessons]);

  function createRows() {
    // create a map: lesson level (convert the lesson level (string) to an int) to a list of student names
    const idNameMapping = new Map<string, string>();
    userList.map((user: IUser) =>
      // eslint-disable-next-line
      idNameMapping.set(user._id, `${user.firstName} ${user.lastName}`),
    );
    const idNumberMapping = new Map<string, number>();
    lessonList.map((lesson: ILesson) =>
      // eslint-disable-next-line
      idNumberMapping.set(lesson._id, lesson.number),
    );

    const levelToStudents = new Map<number, string[]>();
    // eslint-disable-next-line
    studentList.map((student: IStudent) => {
      const lessonID = student.lesson_level;
      let lessonNum = idNumberMapping.get(lessonID);
      if (!lessonNum) {
        lessonNum = 1;
      }
      // const levelNameParsed = student.lesson_level.split(' ');
      // const lessonLevelInt = Number(levelNameParsed[1]);
      let tempArray = levelToStudents.get(lessonNum);
      if (!tempArray) {
        tempArray = [];
      }
      let name = idNameMapping.get(student.user_id);
      if (!name) {
        name = '';
      }
      tempArray.push(name);
      // eslint-disable-next-line
      levelToStudents.set(lessonNum, tempArray);
    });
    // eslint-disable-next-line
    const rows: PhoneticsTableRow[] = [];

    let level = 1;
    // eslint-disable-next-line
    phonicPatterns.map((pattern: string) => {
      // eslint-disable-next-line
      let studentsByLevel = levelToStudents.get(level);
      if (!studentsByLevel) {
        studentsByLevel = [];
      }
      let studentString = '';
      studentsByLevel.map(
        // eslint-disable-next-line
        (studentStr: string) => (studentString += `${studentStr}, `),
      );
      studentString = studentString.substring(0, studentString.length - 2);
      const row: PhoneticsTableRow = {
        key: level.toString(),
        phonetic_pattern: pattern,
        students: studentString,
      };
      level += 1;
      rows.push(row);
    });

    // levelToStudents.forEach((value: string[], key: number) => {
    //   //key is the lesson level
    //   //get the phonetic for each key
    //   let row: PhoneticsTableRow = {
    //     key: key.toString(),
    //     phonetic_pattern: phonicPatterns[key - 1],
    //     students: value,
    //   };
    //   rows.push(row);
    // });

    setRows(rows);
  }

  useEffect(() => {
    createRows();
  });

  // if the userlist is not yet populated, display a loading spinner
  if (!userList) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <Box sx={{ width: '50%', height: '75%' }}>
      <PaginationTable rows={rows} columns={columns} />
    </Box>
  );
}

export default PhoneticsTable;