"use client";

import { useEffect, useMemo, useState } from 'react';
import styles from '../app/page.module.css';
import { formatPersianDate, weekdayNamesFa } from '@utils/date';

// Storage shape: attendance[dateISO][student] = true (absent) | false (present)

type AttendanceRecord = Record<string, Record<string, boolean>>;

function readAttendance(): AttendanceRecord {
  try {
    const raw = localStorage.getItem('attendance');
    return raw ? (JSON.parse(raw) as AttendanceRecord) : {};
  } catch {
    return {};
  }
}

function writeAttendance(data: AttendanceRecord) {
  localStorage.setItem('attendance', JSON.stringify(data));
}

export function AttendanceTable({ students, dates }: { students: string[]; dates: string[] }) {
  const [attendance, setAttendance] = useState<AttendanceRecord>({});

  useEffect(() => {
    setAttendance(readAttendance());
  }, []);

  useEffect(() => {
    writeAttendance(attendance);
  }, [attendance]);

  const toggle = (dateISO: string, student: string) => {
    setAttendance((prev) => {
      const day = { ...(prev[dateISO] || {}) };
      const current = !!day[student];
      day[student] = !current; // true means absent
      return { ...prev, [dateISO]: day };
    });
  };

  const markAll = (dateISO: string, absent: boolean) => {
    setAttendance((prev) => {
      const day: Record<string, boolean> = {};
      for (const s of students) {
        day[s] = absent;
      }
      return { ...prev, [dateISO]: day };
    });
  };

  const presentCountByDay = useMemo(() => {
    const out: Record<string, number> = {};
    for (const d of dates) {
      const day = attendance[d] || {};
      const present = students.filter((s) => !(day[s] === true)).length;
      out[d] = present;
    }
    return out;
  }, [attendance, dates, students]);

  return (
    <div>
      <div className={styles.actionRow}>
        {dates.map((d) => (
          <div key={d} className={styles.row}>
            <span style={{ fontSize: 12 }}>{formatPersianDate(d)}</span>
            <button className={`${styles.button} ${styles.secondary}`} onClick={() => markAll(d, false)}>
              ??? ????
            </button>
            <button className={`${styles.button} ${styles.danger}`} onClick={() => markAll(d, true)}>
              ??? ????
            </button>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>?????????</th>
              {dates.map((d, i) => (
                <th key={d}>
                  <div>{weekdayNamesFa[i]}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{formatPersianDate(d)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s}>
                <td style={{ textAlign: 'right' }}>{s}</td>
                {dates.map((d) => {
                  const day = attendance[d] || {};
                  const isAbsent = !!day[s];
                  return (
                    <td key={d}>
                      <button className={styles.toggle} onClick={() => toggle(d, s)}>
                        {isAbsent ? (
                          <span className={styles.badgeAbsent}>????</span>
                        ) : (
                          <span className={styles.badgePresent}>????</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={1 + dates.length} style={{ color: '#6b7280', textAlign: 'center' }}>
                  ????? ??????????? ?? ????? ????
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>??????</th>
              {dates.map((d) => (
                <th key={d}>{presentCountByDay[d]}</th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
