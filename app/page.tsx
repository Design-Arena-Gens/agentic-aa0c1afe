"use client";

import { useEffect, useMemo, useState } from 'react';
import { StudentList } from '@components/StudentList';
import { AttendanceTable } from '@components/AttendanceTable';
import { WeeklyAbsentees } from '@components/WeeklyAbsentees';
import { getStartOfISOWeek, getWeekDates, isoWeekStringFromDate } from '@utils/date';
import styles from './page.module.css';

export default function HomePage() {
  const [students, setStudents] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('students');
    if (stored) setStudents(JSON.parse(stored));
    const today = new Date();
    const start = getStartOfISOWeek(today);
    setSelectedDate(start.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const weekDates = useMemo(() => {
    if (!selectedDate) return [] as string[];
    return getWeekDates(new Date(selectedDate)).map((d) => d.toISOString().slice(0, 10));
  }, [selectedDate]);

  const isoWeek = useMemo(() => {
    if (!selectedDate) return '';
    return isoWeekStringFromDate(new Date(selectedDate));
  }, [selectedDate]);

  return (
    <main className={styles.container}>
      <h1>???? ? ???? ???????????</h1>

      <section className={styles.card}>
        <h2>???????????</h2>
        <StudentList students={students} onChange={setStudents} />
      </section>

      <section className={styles.card}>
        <h2>?????? ????</h2>
        <div className={styles.row}>
          <label htmlFor="weekStart">????? ???? ???? (???????????):</label>
          <input
            id="weekStart"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <span className={styles.weekBadge}>????: {isoWeek || '-'} </span>
        </div>
      </section>

      <section className={styles.card}>
        <h2>??? ????/???? ????</h2>
        <AttendanceTable students={students} dates={weekDates} />
      </section>

      <section className={styles.card}>
        <h2>????? ?????? ????</h2>
        <WeeklyAbsentees students={students} dates={weekDates} />
      </section>

      <footer className={styles.footer}>
        <span>????????? ???? ????? ????? ??????</span>
      </footer>
    </main>
  );
}
