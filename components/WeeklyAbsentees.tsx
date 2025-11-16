"use client";

import { useEffect, useMemo, useState } from 'react';
import styles from '../app/page.module.css';
import { formatPersianDate } from '@utils/date';

type AttendanceRecord = Record<string, Record<string, boolean>>;

function readAttendance(): AttendanceRecord {
  try {
    const raw = localStorage.getItem('attendance');
    return raw ? (JSON.parse(raw) as AttendanceRecord) : {};
  } catch {
    return {};
  }
}

export function WeeklyAbsentees({ students, dates }: { students: string[]; dates: string[] }) {
  const [attendance, setAttendance] = useState<AttendanceRecord>({});

  useEffect(() => {
    setAttendance(readAttendance());
  }, [dates.join(',')]);

  const absences = useMemo(() => {
    const count: Record<string, number> = {};
    for (const s of students) count[s] = 0;
    for (const d of dates) {
      const day = attendance[d] || {};
      for (const s of students) {
        if (day[s] === true) count[s] += 1;
      }
    }
    const entries = Object.entries(count)
      .filter(([, c]) => c > 0)
      .sort((a, b) => b[1] - a[1]);
    return entries;
  }, [attendance, dates, students]);

  const exportCSV = () => {
    const header = ['???', ...dates.map((d) => formatPersianDate(d)), '??? ????'];
    const rows = absences.map(([name]) => {
      const perDay = dates.map((d) => (attendance[d]?.[name] ? '????' : ''));
      const sum = perDay.filter((v) => v === '????').length;
      return [name, ...perDay, String(sum)];
    });
    const all = [header, ...rows]
      .map((r) => r.map((x) => `"${x.replace(/"/g, '""')}` ).join(','))
      .join('\n');
    const blob = new Blob(["\uFEFF" + all], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekly-absentees.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportText = () => {
    const lines = absences.map(([name, c]) => `${name} - ${c} ???? ????`);
    const text = lines.join('\n');
    navigator.clipboard.writeText(text);
    alert('???? ?????? ?? ????????? ??? ??');
  };

  return (
    <div>
      {absences.length === 0 ? (
        <p style={{ color: '#16a34a' }}>?? ??? ???? ????? ??? ???? ???.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {absences.map(([name, c]) => (
              <li key={name} className={styles.row} style={{ justifyContent: 'space-between' }}>
                <span>{name}</span>
                <span className={styles.badgeAbsent}>{c} ????</span>
              </li>
            ))}
          </ul>
          <div className={styles.actionRow}>
            <button className={styles.button} onClick={exportCSV}>????? CSV</button>
            <button className={`${styles.button} ${styles.secondary}`} onClick={exportText}>??? ????</button>
          </div>
        </div>
      )}
    </div>
  );
}
