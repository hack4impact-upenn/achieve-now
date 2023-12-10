import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PaginationTable, TColumn } from '../components/PaginationTable';
import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';
import IUser from '../util/types/user';

interface PhoneticsTableRow {
  key: string;
  phonetic_pattern: string;
  students: string;
}

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

function TeacherPhoneticsTable() {
  const columns: TColumn[] = [
    { id: 'phonetic_pattern', label: 'Phonetic Pattern', minWidth: 100 },
    { id: 'example_word', label: 'Example Word', minWidth: 100 },
    { id: 'students', label: 'Students', minWidth: 200 },
  ];

  const [phoneticsTableRows, setPhoneticsTableRows] = useState<
    PhoneticsTableRow[]
  >([]);

  const self = useAppSelector(selectUser);
  const studentsData = useData(
    `student/students-lessons-by-teacher/${self.email}`,
  );

  console.log('phonetics table', studentsData);

  useEffect(() => {
    if (studentsData?.data) {
      const phoneticsRows: PhoneticsTableRow[] = phonicPatterns.map(
        (pattern, index) => {
          // Get students whose lesson number aligns with the index of the phonic pattern (adjust for indexing)
          const studentsForPattern = studentsData.data
            .filter((student: any) => student.lessonNumber - 1 === index)
            .map((student: any) => `${student.firstName} ${student.lastName}`)
            .join(', ');

          return {
            key: `row-${index}`,
            phonetic_pattern: pattern,
            example_word: exampleWords[index],
            students: studentsForPattern,
          };
        },
      );

      setPhoneticsTableRows(phoneticsRows);
    }
  }, [studentsData]);

  if (!phoneticsTableRows.length) {
    return (
      <div style={{ width: '0', margin: 'auto' }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return <PaginationTable rows={phoneticsTableRows} columns={columns} />;
}

export default TeacherPhoneticsTable;
